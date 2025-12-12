import { execa } from 'execa';
import chalk from 'chalk';

export async function execute(manager: string, script: string) {
  console.log(chalk.cyan(`> Running: ${manager} run ${script}`));
  
  try {
    await execa(manager, ['run', script], { stdio: 'inherit' });
  } catch (_error) {
    // execa throws if the command fails, but we want to exit cleanly
    // The error message is usually already printed to stderr by the child process
    process.exit(1);
  }
}
