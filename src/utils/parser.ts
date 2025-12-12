import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

export function readPackageJson() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error(chalk.red('No package.json found here.'));
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
}
