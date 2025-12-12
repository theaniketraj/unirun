import fs from 'node:fs';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export async function detectManager(): Promise<PackageManager> {
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('bun.lockb')) return 'bun';
  return 'npm';
}
