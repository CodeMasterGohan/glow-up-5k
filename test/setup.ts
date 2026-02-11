import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

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

// Reset localStorage before each test
beforeEach(() => {
    localStorage.clear();
});
