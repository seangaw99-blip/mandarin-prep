export function speakChinese(text: string, rate: number = 0.8) {
  if (typeof window === 'undefined') return;

  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn('Speech synthesis not available');
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1;

    // Try to find a Chinese voice
    const voices = synth.getVoices();
    const chineseVoice = voices.find(
      (v) =>
        v.lang === 'zh-CN' ||
        v.lang === 'zh-TW' ||
        v.lang === 'zh-HK' ||
        v.lang.startsWith('zh')
    );

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    // Debug logging
    console.log('Speaking:', text, '| Voice:', chineseVoice?.name || 'default', '| Voices available:', voices.length);

    utterance.onerror = (e) => {
      console.error('Speech error:', e.error);
    };

    synth.speak(utterance);
  };

  // If voices are loaded, speak immediately
  const voices = synth.getVoices();
  if (voices.length > 0) {
    speak();
  } else {
    // Wait for voices to load, then speak
    synth.addEventListener('voiceschanged', speak, { once: true });
    // Also try after a short delay as fallback
    setTimeout(() => {
      if (synth.getVoices().length > 0) {
        speak();
      }
    }, 500);
  }
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
}
