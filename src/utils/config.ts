import fs from 'node:fs';
import path from 'node:path';

export interface UnirunConfig {
  scripts?: {
    dev?: string;
    build?: string;
    prod?: string;
  };
}

export function readConfig(): UnirunConfig | null {
  const configFiles = ['.unirunrc', '.unirunrc.json'];
  
  for (const file of configFiles) {
    const configPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(configPath)) {
      try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      } catch (error) {
        console.warn(`Warning: Failed to parse ${file}`, error);
        return null;
      }
    }
  }
  
  return null;
}
