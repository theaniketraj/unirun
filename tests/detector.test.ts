import { describe, it, expect } from 'vitest';
import { detectScript } from '../src/core/detector.js';

describe('detectScript', () => {
  it('should detect dev script', () => {
    const pkg = {
      scripts: {
        dev: 'vite',
        build: 'vite build'
      }
    };
    expect(detectScript('dev', pkg)).toBe('dev');
  });

  it('should prioritize dev over start', () => {
    const pkg = {
      scripts: {
        dev: 'vite',
        start: 'node server.js'
      }
    };
    expect(detectScript('dev', pkg)).toBe('dev');
  });

  it('should detect build script', () => {
    const pkg = {
      scripts: {
        compile: 'tsc'
      }
    };
    expect(detectScript('build', pkg)).toBe('compile');
  });
});
