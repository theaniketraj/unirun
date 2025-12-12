import { execa } from 'execa';
import chalk from 'chalk';

export async function execute(manager: string, command: string, isScript: boolean = true) {
  if (isScript) {
    console.log(chalk.cyan(`> Running: ${manager} run ${command}`));
    try {
      await execa(manager, ['run', command], { stdio: 'inherit' });
    } catch (_error) {
      process.exit(1);
    }
  } else {
    console.log(chalk.cyan(`> Running command: ${command}`));
    try {
      const [cmd, ...args] = command.split(' ');
      await execa(cmd, args, { stdio: 'inherit', preferLocal: true });
    } catch (_error) {
      process.exit(1);
    }
  }
}
