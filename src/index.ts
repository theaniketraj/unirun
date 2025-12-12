#!/usr/bin/env node
import { cac } from 'cac';
import { readPackageJson } from './utils/parser.js';
import { detectScript } from './core/detector.js';
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
        const buildScript = detectScript('build', pkg);
        if (buildScript) {
          console.log(chalk.blue(`Building with ${manager}...`));
          await execute(manager, buildScript);
        }
      }

      // 2. Determine Main Script
      // If user typed 'npx unirun build', scriptArg is 'build'
      // If user typed 'npx unirun', scriptArg is undefined -> default to dev logic
      let targetScript;
      
      if (scriptArg) {
        // User specified a script name specifically
        targetScript = scriptArg;
      } else {
        // Auto-detect
        const mode = options.prod ? 'prod' : 'dev';
        targetScript = detectScript(mode, pkg);
      }

      if (!targetScript) {
        console.log(chalk.red('No suitable script found automatically.'));
        process.exit(1);
      }

      console.log(chalk.green(`Launching ${targetScript}...`));
      await execute(manager, targetScript);

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.parse();
