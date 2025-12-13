import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { execa } from "execa";
import chalk from "chalk";

/**
 * Smart Dependency Checker
 * Checks if node_modules exists and prompts to install if missing
 */
export async function ensureDependencies(manager: string): Promise<void> {
  const nodeModulesPath = path.resolve(process.cwd(), "node_modules");

  // Check if node_modules exists and is not empty
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(chalk.yellow(`node_modules is missing.`));

    const response = await prompts({
      type: "confirm",
      name: "install",
      message: `Would you like to run '${manager} install'?`,
      initial: true,
    });

    if (response.install) {
      console.log(chalk.blue(`Installing dependencies with ${manager}...`));
      try {
        await execa(manager, ["install"], { stdio: "inherit" });
        console.log(chalk.green(`Dependencies installed successfully!`));
      } catch (error) {
        console.error(chalk.red(`Failed to install dependencies:`), error);
        throw error;
      }
    } else {
      console.log(
        chalk.yellow(
          "Skipping dependency installation. The app may not start correctly."
        )
      );
    }
  } else {
    // Check if node_modules is empty (just created but nothing installed)
    const items = fs.readdirSync(nodeModulesPath);
    if (items.length === 0) {
      console.log(chalk.yellow(`node_modules exists but is empty.`));

      const response = await prompts({
        type: "confirm",
        name: "install",
        message: `Would you like to run '${manager} install'?`,
        initial: true,
      });

      if (response.install) {
        console.log(chalk.blue(`Installing dependencies with ${manager}...`));
        try {
          await execa(manager, ["install"], { stdio: "inherit" });
          console.log(chalk.green(`Dependencies installed successfully!`));
        } catch (error) {
          console.error(chalk.red(`Failed to install dependencies:`), error);
          throw error;
        }
      }
    }
  }
}
