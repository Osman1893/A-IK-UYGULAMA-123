import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.uzaktanturkolog.app',
  appName: 'Uzaktan Türkolog',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: [
      'https://api.dicebear.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
  },
  android: {
    backgroundColor: '#0F172A',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    backgroundColor: '#0F172A',
    scrollEnabled: true,
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
