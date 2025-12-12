import { execa } from 'execa';
import chalk from 'chalk';

export async function execute(manager: string, command: string, isScript: boolean = true, args: string[] = []) {
  if (isScript) {
    const fullCommand = `${manager} run ${command}${args.length > 0 ? ' -- ' + args.join(' ') : ''}`;
    console.log(chalk.cyan(`> Running: ${fullCommand}`));
    try {
      await execa(manager, ['run', command, ...(args.length > 0 ? ['--', ...args] : [])], { stdio: 'inherit' });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  } else {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(chalk.cyan(`> Running command: ${fullCommand}`));
    try {
      const [cmd, ...cmdArgs] = command.split(' ');
      await execa(cmd, [...cmdArgs, ...args], { stdio: 'inherit', preferLocal: true });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
