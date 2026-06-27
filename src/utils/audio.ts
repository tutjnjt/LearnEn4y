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
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.play().catch(e => console.warn("Audio fallback failed", e));
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

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
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

    // Timeout fixes some Android issues where cancel() interrupts the next speak()
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 10);

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
