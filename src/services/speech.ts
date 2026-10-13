/**
 * Speech Synthesis (TTS) and Speech Recognition (STT) helper for Kitty.
 */

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onSpeakingChunk?: () => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  private visemeTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          this.recognition = new SpeechRec();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
        } catch {
          // not supported or denied
        }
      }
    }
  }

  speak(text: string, callbacks?: SpeechCallbacks) {
    if (!this.synth) {
      callbacks?.onStart?.();
      setTimeout(() => callbacks?.onEnd?.(), 1000);
      return;
    }

    // Stop ongoing speech
    this.stopSpeaking();

    // Clean text of markdown or emojis for cleaner speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .trim();

    if (!cleanText) {
      callbacks?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.25; // slightly higher, cute and clear friendly pitch

    // Try finding an English female/friendly voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('google us english') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('zira'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      callbacks?.onStart?.();

      // Trigger periodic mouth viseme ticks during speech
      if (this.visemeTimer) clearInterval(this.visemeTimer);
      this.visemeTimer = window.setInterval(() => {
        callbacks?.onSpeakingChunk?.();
      }, 140);
    };

    utterance.onend = () => {
      this.cleanupSpeech(callbacks);
    };

    utterance.onerror = () => {
      this.cleanupSpeech(callbacks);
    };

    try {
      this.synth.speak(utterance);
    } catch {
      this.cleanupSpeech(callbacks);
    }
  }

  stopSpeaking() {
    if (this.visemeTimer) {
      clearInterval(this.visemeTimer);
      this.visemeTimer = null;
    }
    this.isSpeaking = false;
    if (this.synth) {
      this.synth.cancel();
    }
  }

  private cleanupSpeech(callbacks?: SpeechCallbacks) {
    if (this.visemeTimer) {
      clearInterval(this.visemeTimer);
      this.visemeTimer = null;
    }
    this.isSpeaking = false;
    callbacks?.onEnd?.();
  }

  listen(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. You can type in the search bar!');
      return false;
    }

    try {
      this.stopSpeaking();
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch {
      this.isListening = false;
      onError('Unable to access microphone.');
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
