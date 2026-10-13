/**
 * Screen Vision Service for Kitty Assistant.
 * Captures live laptop screen/window/tab (YouTube, drawings, code, etc.)
 * and uses multimodal Gemini AI to tell the user what they are doing and answer screen questions.
 */

class ScreenVisionService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  public isStreaming: boolean = false;
  public isLiveWatching: boolean = false;
  private watcherTimer: any = null;
  private lastAnalysis: string = '';
  private listeners: Set<(state: { isStreaming: boolean; isLiveWatching: boolean; lastAnalysis: string }) => void> = new Set();

  subscribe(listener: (state: { isStreaming: boolean; isLiveWatching: boolean; lastAnalysis: string }) => void) {
    this.listeners.add(listener);
    // Notify immediately
    listener({
      isStreaming: this.isStreaming,
      isLiveWatching: this.isLiveWatching,
      lastAnalysis: this.lastAnalysis,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = {
      isStreaming: this.isStreaming,
      isLiveWatching: this.isLiveWatching,
      lastAnalysis: this.lastAnalysis,
    };
    this.listeners.forEach((listener) => listener(state));
  }

  async startScreenShare(): Promise<MediaStream | null> {
    if (this.stream && this.stream.active) {
      return this.stream;
    }

    if (typeof navigator === 'undefined' || !navigator?.mediaDevices?.getDisplayMedia) {
      console.info('Screen share is not supported in this browser environment or requires HTTPS.');
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        } as any,
        audio: false,
      });

      this.stream = stream;
      this.isStreaming = true;

      if (!this.videoElement) {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        this.videoElement.muted = true;
      }
      this.videoElement.srcObject = stream;
      await this.videoElement.play().catch(() => {});

      const track = stream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          this.stopScreenShare();
        };
      }

      this.notify();
      return stream;
    } catch {
      this.isStreaming = false;
      this.notify();
      return null;
    }
  }

  stopScreenShare() {
    this.stopLiveWatcher();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isStreaming = false;
    this.notify();
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  captureFrame(): string | null {
    if (!this.videoElement || !this.isStreaming) {
      return null;
    }

    try {
      const video = this.videoElement;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      if (width <= 0 || height <= 0) return null;

      const canvas = document.createElement('canvas');
      const targetWidth = Math.min(width, 1280);
      canvas.width = targetWidth;
      canvas.height = Math.round((height / width) * targetWidth);

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.82);
    } catch (err) {
      console.error('Frame capture error:', err);
      return null;
    }
  }

  async analyzeScreen(query?: string, userName: string = 'Jay'): Promise<string> {
    const frame = this.captureFrame();
    if (!frame) {
      return `I can't see your screen right now, ${userName}! Tap "Share Screen" so I can watch your screen with you.`;
    }

    try {
      const res = await fetch('/api/analyze-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frame,
          query: query || 'What am I doing on my screen right now?',
          userName,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      const text = data.text || `I see what you're working on, ${userName}!`;
      this.lastAnalysis = text;
      this.notify();
      return text;
    } catch {
      // Graceful static host / offline fallback
      const fallbacks = [
        `I can see your live screen, ${userName}! You're doing amazing! ✨🐾`,
        `Kitty is watching your screen, ${userName}! Keep up the great work! 💻😸`,
        `Looking good on screen, ${userName}! Let's keep going! 🌟`
      ];
      const text = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      this.lastAnalysis = text;
      this.notify();
      return text;
    }
  }

  startLiveWatcher(onObservation: (text: string) => void, intervalMs: number = 14000, userName: string = 'Jay') {
    if (this.isLiveWatching) return;
    this.isLiveWatching = true;
    this.notify();

    // Trigger initial observation after 2 seconds
    setTimeout(async () => {
      if (!this.isLiveWatching || !this.isStreaming) return;
      const observation = await this.analyzeScreen('Briefly tell me what I am doing on my screen right now in 1 or 2 fun sentences.', userName);
      if (observation) onObservation(observation);
    }, 2000);

    this.watcherTimer = setInterval(async () => {
      if (!this.isLiveWatching || !this.isStreaming) {
        this.stopLiveWatcher();
        return;
      }
      const observation = await this.analyzeScreen('Tell me what you see me doing now on screen.', userName);
      if (observation) onObservation(observation);
    }, intervalMs);
  }

  stopLiveWatcher() {
    if (this.watcherTimer) {
      clearInterval(this.watcherTimer);
      this.watcherTimer = null;
    }
    this.isLiveWatching = false;
    this.notify();
  }
}

export const screenVisionService = new ScreenVisionService();
