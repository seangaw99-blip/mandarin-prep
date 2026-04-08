export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

export function listenForChinese(): Promise<RecognitionResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      reject(new Error('Speech recognition not supported in this browser. Try Chrome.'));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      resolve({
        transcript: result.transcript,
        confidence: result.confidence,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        reject(new Error('No speech detected. Try again.'));
      } else if (event.error === 'not-allowed') {
        reject(new Error('Microphone access denied. Allow microphone in browser settings.'));
      } else {
        reject(new Error(`Speech error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      // If no result was captured
    };

    recognition.start();
  });
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
  // Normalize strings for comparison
  const normalize = (s: string) =>
    s.replace(/[，。？！、\s]/g, '').toLowerCase();

  const spokenNorm = normalize(spoken);
  const expectedNorm = normalize(expected);

  // Exact match
  if (spokenNorm === expectedNorm) {
    const score = Math.round(85 + confidence * 15);
    return {
      score,
      grade: score >= 95 ? 'perfect' : 'great',
      feedback: score >= 95 ? 'Perfect pronunciation!' : 'Great job! Very close to native.',
    };
  }

  // Calculate character-level similarity
  const maxLen = Math.max(spokenNorm.length, expectedNorm.length);
  if (maxLen === 0) {
    return { score: 0, grade: 'try-again', feedback: 'No speech detected.' };
  }

  let matches = 0;
  const expectedChars = expectedNorm.split('');
  const spokenChars = spokenNorm.split('');

  // Count matching characters (order-aware)
  for (let i = 0; i < Math.min(spokenChars.length, expectedChars.length); i++) {
    if (spokenChars[i] === expectedChars[i]) {
      matches++;
    }
  }

  // Also check for characters present but in wrong position
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
