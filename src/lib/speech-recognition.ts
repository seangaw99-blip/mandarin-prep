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
let resolved = false;

export function listenForChinese(): RecognitionController {
  // Stop any existing recognition
  if (activeRecognition) {
    try { activeRecognition.stop(); } catch {}
    activeRecognition = null;
  }
  resolved = false;

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

  // Track the full transcript by rebuilding from all results each time
  let latestTranscript = '';
  let latestConfidence = 0;
  let hasResult = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    // Rebuild the full transcript from ALL results every time
    let fullTranscript = '';
    let lastConfidence = 0;

    for (let i = 0; i < event.results.length; i++) {
      fullTranscript += event.results[i][0].transcript;
      lastConfidence = event.results[i][0].confidence || 0.5;
    }

    latestTranscript = fullTranscript;
    latestConfidence = lastConfidence;
    hasResult = true;
  };

  const doResolve = () => {
    if (resolved) return;
    resolved = true;
    activeRecognition = null;
    if (hasResult && latestTranscript.trim()) {
      resolvePromise!({ transcript: latestTranscript, confidence: latestConfidence });
    } else {
      rejectPromise!(new Error('No speech detected. Try again.'));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (resolved) return;
    if (event.error === 'aborted') {
      doResolve();
    } else if (event.error === 'no-speech') {
      resolved = true;
      activeRecognition = null;
      rejectPromise!(new Error('No speech detected. Try again.'));
    } else if (event.error === 'not-allowed') {
      resolved = true;
      activeRecognition = null;
      rejectPromise!(new Error('Microphone access denied. Allow microphone in browser settings.'));
    } else {
      resolved = true;
      activeRecognition = null;
      rejectPromise!(new Error(`Speech error: ${event.error}`));
    }
  };

  recognition.onend = () => {
    doResolve();
  };

  recognition.start();
  activeRecognition = recognition;

  const stop = () => {
    if (activeRecognition) {
      try { activeRecognition.stop(); } catch {}
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
