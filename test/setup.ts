import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock AudioContext
class AudioContextMock {
  createGain() {
    return {
      connect: () => {},
      gain: {
        value: 0,
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
    };
  }
  createOscillator() {
    return {
      type: '',
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        value: 0,
      },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  close() {
    return Promise.resolve();
  }
  resume() {
    return Promise.resolve();
  }
  get currentTime() {
    return 0;
  }
  get state() {
    return 'running';
  }
  get destination() {
    return {};
  }
}

Object.defineProperty(window, 'AudioContext', {
  value: AudioContextMock,
});
Object.defineProperty(window, 'webkitAudioContext', {
  value: AudioContextMock,
});

// Mock WakeLock
Object.defineProperty(navigator, 'wakeLock', {
  value: {
    request: () => Promise.resolve({
      release: () => Promise.resolve(),
    }),
  },
  writable: true,
});

// Mock SpeechSynthesis
const speechSynthesisMock = {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: () => [],
    pause: vi.fn(),
    resume: vi.fn(),
    paused: false,
    pending: false,
    speaking: false,
    onvoiceschanged: null,
};

Object.defineProperty(window, 'speechSynthesis', {
    value: speechSynthesisMock,
    writable: true,
});

class SpeechSynthesisUtteranceMock {
    text: string;
    lang: string;
    pitch: number;
    rate: number;
    volume: number;
    voice: SpeechSynthesisVoice | null;

    constructor(text?: string) {
        this.text = text || '';
        this.lang = 'en-US';
        this.pitch = 1;
        this.rate = 1;
        this.volume = 1;
        this.voice = null;
    }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: SpeechSynthesisUtteranceMock,
    writable: true,
});

// Reset localStorage before each test
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});
