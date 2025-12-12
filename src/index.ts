#!/usr/bin/env node
import { cac } from 'cac';
import prompts from 'prompts';
import { readPackageJson } from './utils/parser.js';
import { detectScript, detectMatchingScripts, detectFrameworkCommand, type DetectedCommand } from './core/detector.js';
import { execute } from './core/executor.js';
import { detectManager } from './core/manager.js';
import chalk from 'chalk';

const cli = cac('unirun');

cli
  .command('[script]', 'Run a script (default: dev)')
  .option('--build', 'Build before running')
  .option('--prod', 'Run in production mode')
  .action(async (scriptArg, options) => {
    try {
      const pkg = readPackageJson();
      const manager = await detectManager();

      // 1. Handle Build
      if (options.build) {
        const buildCmd = detectScript('build', pkg);
        if (buildCmd) {
          console.log(chalk.blue(`⚙️  Building with ${manager}...`));
          await execute(manager, buildCmd.value, buildCmd.type === 'script');
        }
      }

      // 2. Determine Main Script
      let target: DetectedCommand | null = null;
      
      if (scriptArg) {
        // User specified a script name specifically
        target = { type: 'script', value: scriptArg };
      } else {
        // Auto-detect
        const mode = options.prod ? 'prod' : 'dev';
        
        const matches = detectMatchingScripts(mode, pkg);
        
        if (matches.length === 1) {
          target = { type: 'script', value: matches[0] };
        } else if (matches.length > 1) {
          // Interactive prompt
          const response = await prompts({
            type: 'select',
            name: 'script',
            message: 'Multiple scripts found. Which one do you want to run?',
            choices: matches.map(s => ({ title: s, value: s }))
          });
          
          if (!response.script) {
            console.log(chalk.yellow('Operation cancelled.'));
            process.exit(0);
          }
          target = { type: 'script', value: response.script };
        } else {
          // No scripts found, try framework
          target = detectFrameworkCommand(mode, pkg);
        }
      }

      if (!target) {
        console.log(chalk.red('❌ No suitable script found automatically.'));
        process.exit(1);
      }

      console.log(chalk.green(`🚀 Launching ${target.value}...`));
      await execute(manager, target.value, target.type === 'script');

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.parse();
