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
    expect(detectScript('dev', pkg)).toEqual({ type: 'script', value: 'dev', source: 'package.json' });
  });

  it('should prioritize dev over start', () => {
    const pkg = {
      scripts: {
        dev: 'vite',
        start: 'node server.js'
      }
    };
    expect(detectScript('dev', pkg)).toEqual({ type: 'script', value: 'dev', source: 'package.json' });
  });

  it('should detect build script', () => {
    const pkg = {
      scripts: {
        compile: 'tsc'
      }
    };
    expect(detectScript('build', pkg)).toEqual({ type: 'script', value: 'compile', source: 'package.json' });
  });

  it('should detect framework if scripts are missing', () => {
    const pkg = {
      scripts: {},
      dependencies: {
        next: '13.0.0'
      }
    };
    expect(detectScript('dev', pkg)).toEqual({ type: 'command', value: 'next dev', source: 'next' });
  });
});
