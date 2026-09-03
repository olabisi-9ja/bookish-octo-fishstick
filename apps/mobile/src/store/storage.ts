import { Platform } from 'react-native';

const STORAGE_KEY = 'comuta.mobile.v1';
let mmkvInstance: any = null;

try {
  if (Platform.OS !== 'web') {
    const { MMKV } = require('react-native-mmkv');
    mmkvInstance = new MMKV({ id: STORAGE_KEY });
  }
} catch (e) {
  console.warn('Failed to initialize MMKV', e);
}

export const storage = {
  getItem: (key: string): string | null => {
    if (!mmkvInstance) return null;
    return mmkvInstance.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (mmkvInstance) {
      mmkvInstance.set(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (mmkvInstance) {
      mmkvInstance.delete(key);
    }
  },
  clearAll: (): void => {
    if (mmkvInstance) {
      mmkvInstance.clearAll();
    }
  }
};
