import { ensureDependencies } from "../checkers/dependencies.js";
import { ensureEnvFile } from "../checkers/env.js";
import {
  checkPortAvailability,
  extractPortFromScript,
} from "../checkers/port.js";
import type { PackageJson } from "../utils/parser.js";
import chalk from "chalk";

export interface PipelineContext {
  manager: string;
  script?: string;
  pkg?: PackageJson;
}

export interface PipelineResult {
  shouldContinue: boolean;
  modifiedPort?: number;
}

/**
 * Pipeline Orchestrator
 * Runs all pre-flight checks in sequence before executing the main command
 */
export async function runPipeline(
  context: PipelineContext
): Promise<PipelineResult> {
  console.log(chalk.blue("Running pre-flight checks...\n"));

  try {
    // 1. Check Dependencies (only for Node projects with package.json)
    if (context.pkg) {
      await ensureDependencies(context.manager);
    }

    // 2. Check Environment Variables
    await ensureEnvFile();

    // 3. Check Port Conflicts (if applicable)
    let modifiedPort: number | undefined;
    if (context.script) {
      const detectedPort = extractPortFromScript(context.script);
      if (detectedPort) {
        const availablePort = await checkPortAvailability(detectedPort);
        if (availablePort !== detectedPort) {
          modifiedPort = availablePort;
        }
      }
    }

    console.log(chalk.green("\nAll pre-flight checks passed!\n"));

    return {
      shouldContinue: true,
      modifiedPort,
    };
  } catch (error) {
    console.error(chalk.red("\nPre-flight check failed:"), error);
    return {
      shouldContinue: false,
    };
  }
}

/**
 * Lightweight pipeline for cases where we don't need all checks
 */
export async function runMinimalPipeline(
  context: PipelineContext
): Promise<PipelineResult> {
  try {
    // Only run dependency and env checks
    if (context.pkg) {
      await ensureDependencies(context.manager);
    }
    await ensureEnvFile();

    return { shouldContinue: true };
  } catch (error) {
    console.error(chalk.red("Pre-flight check failed:"), error);
    return { shouldContinue: false };
  }
}
