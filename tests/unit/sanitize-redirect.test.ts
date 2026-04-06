import { describe, it, expect } from 'vitest';
import { sanitizeRedirectPath } from '@/lib/auth';

describe('sanitizeRedirectPath', () => {
  it('allows normal internal paths', () => {
    expect(sanitizeRedirectPath('/cuenta')).toBe('/cuenta');
    expect(sanitizeRedirectPath('/cuenta/perfil')).toBe('/cuenta/perfil');
    expect(sanitizeRedirectPath('/bogota/arriendos/apt-123')).toBe('/bogota/arriendos/apt-123');
    expect(sanitizeRedirectPath('/')).toBe('/');
  });

  it('allows paths with query strings', () => {
    expect(sanitizeRedirectPath('/cuenta?tab=perfil')).toBe('/cuenta?tab=perfil');
  });

  it('defaults to /cuenta for null/undefined/empty', () => {
    expect(sanitizeRedirectPath(null)).toBe('/cuenta');
    expect(sanitizeRedirectPath(undefined)).toBe('/cuenta');
    expect(sanitizeRedirectPath('')).toBe('/cuenta');
  });

  it('blocks protocol-relative URLs (open redirect)', () => {
    expect(sanitizeRedirectPath('//evil.com')).toBe('/cuenta');
    expect(sanitizeRedirectPath('//evil.com/path')).toBe('/cuenta');
  });

  it('blocks paths not starting with /', () => {
    expect(sanitizeRedirectPath('https://evil.com')).toBe('/cuenta');
    expect(sanitizeRedirectPath('http://evil.com')).toBe('/cuenta');
    expect(sanitizeRedirectPath('evil.com/path')).toBe('/cuenta');
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/cuenta');
  });

  it('blocks backslash tricks', () => {
    // /\evil.com can be interpreted as //evil.com by some browsers
    expect(sanitizeRedirectPath('/\\evil.com')).toBe('/cuenta');
  });
});
