#!/usr/bin/env node
import { cac } from 'cac';
import prompts from 'prompts';
import { readPackageJson } from './utils/parser.js';
import { readConfig } from './utils/config.js';
import { detectScript, detectMatchingScripts, detectFrameworkCommand, type DetectedCommand } from './core/detector.js';
import { execute } from './core/executor.js';
import { detectManager } from './core/manager.js';
import { detectMonorepo } from './core/monorepo.js';
import chalk from 'chalk';

const cli = cac('unirun');

cli
  .command('[script]', 'Run a script (default: dev)')
  .option('--build', 'Build before running')
  .option('--prod', 'Run in production mode')
  .allowUnknownOptions() // Allow extra flags like --port 3000
  .action(async (scriptArg, options) => {
    try {
      const pkg = readPackageJson();
      const config = readConfig();
      const manager = await detectManager();
      const monorepo = detectMonorepo();

      // Extract extra args (exclude known options)
      const knownOptions = new Set(['build', 'prod', '--']);
      const extraArgs = Object.keys(options)
        .filter(key => !knownOptions.has(key))
        .map(key => {
          const value = options[key];
          return value === true ? `--${key}` : `--${key} ${value}`;
        });
      
      // Add args passed after --
      if (options['--']) {
        extraArgs.push(...options['--']);
      }

      // 1. Handle Build
      if (options.build) {
        const buildCmd = detectScript('build', pkg, config);
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
        
        // Check Config First
        if (config?.scripts?.[mode]) {
          target = { type: 'script', value: config.scripts[mode], source: '.unirunrc' };
        } else {
          // Monorepo Override
          if (monorepo) {
             const tool = monorepo === 'turbo' ? 'npx turbo' : 'npx nx';
             const matches = detectMatchingScripts(mode, pkg);
             const scriptName = matches[0] || (mode === 'prod' ? 'start' : 'dev');
             
             console.log(chalk.magenta(`✨ Monorepo detected (${monorepo}). Delegating...`));
             await execute(manager, `${tool} run ${scriptName}`, false, extraArgs);
             return;
          }

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
      }

      if (!target) {
        console.log(chalk.red('❌ No suitable script found automatically.'));
        process.exit(1);
      }

      console.log(chalk.green(`🚀 Launching ${target.value}...`));
      await execute(manager, target.value, target.type === 'script', extraArgs);

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.parse();
