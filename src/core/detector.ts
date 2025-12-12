export type RunMode = 'dev' | 'build' | 'prod';

export interface DetectedCommand {
  type: 'script' | 'command';
  value: string;
  source?: string;
}

const FRAMEWORKS: Record<string, Record<RunMode, string>> = {
  next: { dev: 'next dev', build: 'next build', prod: 'next start' },
  vite: { dev: 'vite', build: 'vite build', prod: 'vite preview' },
  'react-scripts': { dev: 'react-scripts start', build: 'react-scripts build', prod: 'react-scripts start' },
  '@vue/cli-service': { dev: 'vue-cli-service serve', build: 'vue-cli-service build', prod: 'vue-cli-service serve' },
  nuxt: { dev: 'nuxt dev', build: 'nuxt build', prod: 'nuxt start' },
  astro: { dev: 'astro dev', build: 'astro build', prod: 'astro preview' },
};

export function detectFrameworkCommand(mode: RunMode, pkg: any): DetectedCommand | null {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  for (const [framework, commands] of Object.entries(FRAMEWORKS)) {
    if (deps[framework]) {
      return { type: 'command', value: commands[mode], source: framework };
    }
  }
  return null;
}

export function detectMatchingScripts(mode: RunMode, pkg: any): string[] {
  const scripts = pkg.scripts || {};
  
  // Priority Lists
  const priorities = {
    dev: ['dev', 'start', 'serve', 'watch', 'server'],
    build: ['build', 'compile', 'package', 'dist'],
    prod: ['start', 'run', 'serve']
  };

  const candidates = priorities[mode];
  return candidates.filter(key => scripts[key]);
}

export function detectScript(mode: RunMode, pkg: any): DetectedCommand | null {
  const matches = detectMatchingScripts(mode, pkg);
  if (matches.length > 0) return { type: 'script', value: matches[0], source: 'package.json' };
  
  return detectFrameworkCommand(mode, pkg);
}
