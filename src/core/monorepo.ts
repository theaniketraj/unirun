import fs from 'node:fs';

export type MonorepoTool = 'turbo' | 'nx' | null;

export function detectMonorepo(): MonorepoTool {
  if (fs.existsSync('turbo.json')) return 'turbo';
  if (fs.existsSync('nx.json')) return 'nx';
  return null;
}
