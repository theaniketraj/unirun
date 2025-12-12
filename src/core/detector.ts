export type RunMode = 'dev' | 'build' | 'prod';

export function detectScript(mode: RunMode, pkg: any): string | null {
  const scripts = pkg.scripts || {};
  
  // Priority Lists
  const priorities = {
    dev: ['dev', 'start', 'serve', 'watch', 'server'],
    build: ['build', 'compile', 'package', 'dist'],
    prod: ['start', 'run', 'serve']
  };

  const candidates = priorities[mode];

  // 1. Exact Match in Scripts
  for (const key of candidates) {
    if (scripts[key]) return key;
  }

  // 2. (Future) Framework Heuristics
  // if (pkg.dependencies['next']) return 'next dev';

  return null;
}
