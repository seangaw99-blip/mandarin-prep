export function speakChinese(text: string, rate: number = 0.8) {
  if (typeof window === 'undefined') return;

  const synth = window.speechSynthesis;
  if (!synth) return;

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  utterance.pitch = 1;

  // Try to find a Chinese voice
  const voices = synth.getVoices();
  const chineseVoice = voices.find(
    (v) => v.lang === 'zh-CN' || v.lang === 'zh-TW' || v.lang.startsWith('zh')
  );
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  synth.speak(utterance);

  // Chrome bug: if getVoices() was empty (not loaded yet), retry after voiceschanged
  if (voices.length === 0) {
    synth.addEventListener(
      'voiceschanged',
      () => {
        const retryVoices = synth.getVoices();
        const retryVoice = retryVoices.find(
          (v) => v.lang === 'zh-CN' || v.lang === 'zh-TW' || v.lang.startsWith('zh')
        );
        const retryUtterance = new SpeechSynthesisUtterance(text);
        retryUtterance.lang = 'zh-CN';
        retryUtterance.rate = rate;
        retryUtterance.pitch = 1;
        if (retryVoice) retryUtterance.voice = retryVoice;
        synth.speak(retryUtterance);
      },
      { once: true }
    );
  }
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
}
