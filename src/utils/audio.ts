export const initAudio = () => {
  try {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
    const a = new Audio();
    a.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    a.play().catch(() => {});
  } catch (e) {}
};

export const playAudioFallback = (text: string) => {
  try {
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
    const audio = new Audio(url);
    audio.play().catch(e => {
      console.warn("Audio fallback failed", e);
      // fallback to google translate if youdao fails
      const gUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
      new Audio(gUrl).play().catch(console.error);
    });
  } catch (e) {
    console.warn("Audio creation failed", e);
  }
};

export const speak = (text: string, rate: number = 0.9) => {
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!("speechSynthesis" in window)) {
      playAudioFallback(text);
      return;
    }

    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // For Android, Web Speech API TTS is notoriously buggy (silent failures, missing voices).
    // Using an Audio fallback directly for short text (like IPA words) provides a 100% reliable experience.
    if (isAndroid && text.length < 100) {
      playAudioFallback(text);
      return;
    }
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (isAndroid) {
        // On Android, cancelling and immediately speaking often drops the speak.
        // We delay slightly if we just cancelled, but we risk losing the user gesture.
        // Actually, if we just cancelled, we might as well just use the fallback for this utterance
        // to guarantee they hear it, or try speaking anyway.
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    
    // Keep reference to prevent GC bug in Android Chrome
    (window as any)._currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang.replace('_', '-').startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    let hasSpoken = false;

    utterance.onstart = () => {
      hasSpoken = true;
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      playAudioFallback(text);
    };

    // Do NOT use setTimeout here, as Android requires speak() to be called 
    // in the same synchronous call stack as the user interaction
    window.speechSynthesis.speak(utterance);

    // If onstart doesn't fire within 500ms (often happens on Android), fallback to audio
    if (isMobile) {
      setTimeout(() => {
        if (!hasSpoken && !window.speechSynthesis.speaking) {
          console.log("SpeechSynthesis didn't start, falling back to audio URL");
          playAudioFallback(text);
        }
      }, 500);
    }

  } catch (e) {
    console.warn("Speech synthesis failed:", e);
    playAudioFallback(text);
  }
};
