export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

export interface RecognitionController {
  stop: () => void;
  promise: Promise<RecognitionResult>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let activeRecognition: any = null;

export function listenForChinese(): RecognitionController {
  // Stop any existing recognition
  if (activeRecognition) {
    try { activeRecognition.stop(); } catch {}
    activeRecognition = null;
  }

  let resolvePromise: (result: RecognitionResult) => void;
  let rejectPromise: (error: Error) => void;

  const promise = new Promise<RecognitionResult>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  if (typeof window === 'undefined') {
    rejectPromise!(new Error('Not in browser'));
    return { stop: () => {}, promise };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    rejectPromise!(new Error('Speech recognition not supported in this browser. Try Chrome.'));
    return { stop: () => {}, promise };
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.lang = 'zh-CN';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  let finalTranscript = '';
  let finalConfidence = 0;
  let hasResult = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
        finalConfidence = result[0].confidence;
        hasResult = true;
      } else {
        interim += result[0].transcript;
      }
    }
    // If we have interim but no final yet, store it as backup
    if (!hasResult && interim) {
      finalTranscript = interim;
      finalConfidence = 0.5;
      hasResult = true;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    activeRecognition = null;
    if (event.error === 'no-speech') {
      rejectPromise!(new Error('No speech detected. Try again.'));
    } else if (event.error === 'not-allowed') {
      rejectPromise!(new Error('Microphone access denied. Allow microphone in browser settings.'));
    } else if (event.error === 'aborted') {
      // User stopped -- resolve with whatever we have
      if (hasResult) {
        resolvePromise!({ transcript: finalTranscript, confidence: finalConfidence });
      } else {
        rejectPromise!(new Error('No speech detected. Try again.'));
      }
    } else {
      rejectPromise!(new Error(`Speech error: ${event.error}`));
    }
  };

  recognition.onend = () => {
    activeRecognition = null;
    if (hasResult) {
      resolvePromise!({ transcript: finalTranscript, confidence: finalConfidence });
    }
  };

  recognition.start();
  activeRecognition = recognition;

  const stop = () => {
    if (activeRecognition) {
      try { activeRecognition.stop(); } catch {}
      activeRecognition = null;
      // If we have results, resolve immediately
      if (hasResult) {
        resolvePromise!({ transcript: finalTranscript, confidence: finalConfidence });
      } else {
        rejectPromise!(new Error('No speech detected. Try again.'));
      }
    }
  };

  return { stop, promise };
}

export function scorePronunciation(
  spoken: string,
  expected: string,
  confidence: number
): {
  score: number;
  grade: 'perfect' | 'great' | 'good' | 'fair' | 'try-again';
  feedback: string;
} {
  const normalize = (s: string) =>
    s.replace(/[，。？！、\s]/g, '').toLowerCase();

  const spokenNorm = normalize(spoken);
  const expectedNorm = normalize(expected);

  if (spokenNorm === expectedNorm) {
    const score = Math.round(85 + confidence * 15);
    return {
      score,
      grade: score >= 95 ? 'perfect' : 'great',
      feedback: score >= 95 ? 'Perfect pronunciation!' : 'Great job! Very close to native.',
    };
  }

  const maxLen = Math.max(spokenNorm.length, expectedNorm.length);
  if (maxLen === 0) {
    return { score: 0, grade: 'try-again', feedback: 'No speech detected.' };
  }

  let matches = 0;
  const expectedChars = expectedNorm.split('');
  const spokenChars = spokenNorm.split('');

  for (let i = 0; i < Math.min(spokenChars.length, expectedChars.length); i++) {
    if (spokenChars[i] === expectedChars[i]) {
      matches++;
    }
  }

  let partialMatches = 0;
  const remainingExpected = [...expectedChars];
  for (const char of spokenChars) {
    const idx = remainingExpected.indexOf(char);
    if (idx !== -1) {
      partialMatches++;
      remainingExpected.splice(idx, 1);
    }
  }

  const orderScore = matches / maxLen;
  const contentScore = partialMatches / maxLen;
  const rawScore = orderScore * 0.6 + contentScore * 0.3 + confidence * 0.1;
  const score = Math.round(Math.min(rawScore * 100, 100));

  if (score >= 90) {
    return { score, grade: 'perfect', feedback: 'Perfect!' };
  } else if (score >= 75) {
    return {
      score,
      grade: 'great',
      feedback: `Great! You said "${spoken}" — very close.`,
    };
  } else if (score >= 55) {
    return {
      score,
      grade: 'good',
      feedback: `Good effort! You said "${spoken}". Expected "${expected}".`,
    };
  } else if (score >= 35) {
    return {
      score,
      grade: 'fair',
      feedback: `Keep practicing! You said "${spoken}". Try to say "${expected}".`,
    };
  } else {
    return {
      score,
      grade: 'try-again',
      feedback: `Try again! The phrase is "${expected}". Listen to the audio first.`,
    };
  }
}
