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

export const playAudioFallback = (text: string, rate: number = 0.9) => {
  if (!text) return;
  try {
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=en-GB&client=gtx&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.play().catch(e => {
      console.warn("Google TTS failed, falling back to Youdao", e);
      const yUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`;
      const yAudio = new Audio(yUrl);
      yAudio.playbackRate = rate;
      yAudio.play().catch(console.error);
    });
  } catch (e) {
    console.warn("Audio creation failed", e);
  }
};

export const speak = (text: string, rate: number = 0.9) => {
  if (!text) return;
  
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!("speechSynthesis" in window)) {
      playAudioFallback(text, rate);
      return;
    }

    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = rate;
    
    // Keep reference to prevent GC bug in Android Chrome
    (window as any)._currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Try to find a consistent UK Female voice
      const ukVoice = voices.find(v => v.name.includes("Google UK English Female")) ||
                      voices.find(v => v.lang === "en-GB" && v.name.includes("Female")) ||
                      voices.find(v => v.lang === "en-GB") ||
                      voices.find(v => v.lang.replace('_', '-').startsWith('en-GB'));
      if (ukVoice) {
        utterance.voice = ukVoice;
      }
    }

    let hasSpoken = false;

    utterance.onstart = () => {
      hasSpoken = true;
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      playAudioFallback(text, rate);
    };

    window.speechSynthesis.speak(utterance);

    // If onstart doesn't fire within 500ms (often happens on Android), fallback to audio
    if (isMobile) {
      setTimeout(() => {
        if (!hasSpoken && !window.speechSynthesis.speaking) {
          console.log("SpeechSynthesis didn't start, falling back to audio URL");
          playAudioFallback(text, rate);
        }
      }, 500);
    }

  } catch (e) {
    console.warn("Speech synthesis failed:", e);
    playAudioFallback(text, rate);
  }
};
