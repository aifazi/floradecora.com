import { assertSafeUrl } from './url';

describe('assertSafeUrl', () => {
  it('allows public https urls', () => {
    expect(assertSafeUrl('https://account.r2.cloudflarestorage.com').hostname).toBe(
      'account.r2.cloudflarestorage.com',
    );
    expect(assertSafeUrl('https://smtp.example.com').hostname).toBe('smtp.example.com');
  });

  it('blocks loopback addresses', () => {
    expect(() => assertSafeUrl('http://127.0.0.1:5432')).toThrow();
    expect(() => assertSafeUrl('http://localhost:3002')).toThrow();
  });

  it('blocks cloud metadata endpoint', () => {
    expect(() => assertSafeUrl('http://169.254.169.254/latest')).toThrow();
  });

  it('blocks private ranges', () => {
    expect(() => assertSafeUrl('http://10.0.0.5')).toThrow();
    expect(() => assertSafeUrl('http://192.168.1.1')).toThrow();
    expect(() => assertSafeUrl('http://172.16.0.1')).toThrow();
    expect(() => assertSafeUrl('http://172.31.255.255')).toThrow();
  });

  it('rejects non-http(s) schemes', () => {
    expect(() => assertSafeUrl('file:///etc/passwd')).toThrow();
    expect(() => assertSafeUrl('gopher://x')).toThrow();
  });

  it('rejects malformed urls', () => {
    expect(() => assertSafeUrl('not-a-url')).toThrow();
  });
});
