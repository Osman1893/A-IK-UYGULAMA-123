import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityService } from '../services/securityService';
import { storageService, SUPER_ADMIN_EMAIL } from '../services/storageService';

// Polyfill localStorage and sessionStorage for Node test runner
const createStorageMock = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, String(value)); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() { return store.size; },
  } as Storage;
};

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = createStorageMock();
}
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = createStorageMock();
}

describe('SecurityService & Storage Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Cryptographic SHA-256 Hashing', () => {
    it('produces correct standard SHA-256 hashes for strings', () => {
      // Known SHA-256 test vectors
      expect(SecurityService.sha256('')).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
      expect(SecurityService.sha256('hello')).toBe(
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
      );
    });

    it('validates password requirements', () => {
      expect(SecurityService.validatePassword('').isValid).toBe(false);
      expect(SecurityService.validatePassword('123').isValid).toBe(false);
      expect(SecurityService.validatePassword('1234').isValid).toBe(true);
    });
  });

  describe('Anti-Brute-Force Rate Limiting', () => {
    it('records failed attempts and triggers lockout after threshold', () => {
      const key = 'test_rate_limit';
      SecurityService.resetRateLimit(key);

      const check1 = SecurityService.checkRateLimit(key, 3, 60000);
      expect(check1.allowed).toBe(true);

      SecurityService.recordFailedAttempt(key);
      SecurityService.recordFailedAttempt(key);
      SecurityService.recordFailedAttempt(key);

      const check2 = SecurityService.checkRateLimit(key, 3, 60000);
      expect(check2.allowed).toBe(false);
      expect(check2.remainingAttempts).toBe(0);

      SecurityService.resetRateLimit(key);
      const check3 = SecurityService.checkRateLimit(key, 3, 60000);
      expect(check3.allowed).toBe(true);
    });
  });

  describe('Admin Password Management & Zero-Plaintext Security', () => {
    it('rejects incorrect admin passwords with rate limiting', () => {
      const result = storageService.loginAsSuperAdmin('wrong_password');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Hatalı yönetici şifresi');
    });

    it('allows changing admin password and saves only SHA-256 hash', () => {
      const newPass = 'YeniGucluSifre2025!';
      const changeResult = storageService.changeAdminPassword(newPass);
      expect(changeResult.success).toBe(true);

      // Verify that plaintext password is NOT in localStorage
      const allStorageValues = Object.values(localStorage);
      expect(allStorageValues).not.toContain(newPass);

      // Verify that SHA-256 hash IS in localStorage
      const expectedHash = SecurityService.sha256(newPass);
      expect(localStorage.getItem('uzaktan_turkolog_admin_hash_v1')).toBe(expectedHash);

      // Verify login succeeds with the new password
      const loginResult = storageService.loginAsSuperAdmin(newPass);
      expect(loginResult.success).toBe(true);
      expect(loginResult.user.isSuperAdmin).toBe(true);
      expect(loginResult.user.email).toBe(SUPER_ADMIN_EMAIL);
    });
  });
});
