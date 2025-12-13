import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import chalk from "chalk";

/**
 * Environment Variable Auto-Setup
 * Checks if .env exists and offers to copy from .env.example or .env.template
 */
export async function ensureEnvFile(): Promise<void> {
  const envPath = path.resolve(process.cwd(), ".env");
  const examplePaths = [
    { path: path.resolve(process.cwd(), ".env.example"), name: ".env.example" },
    {
      path: path.resolve(process.cwd(), ".env.template"),
      name: ".env.template",
    },
    { path: path.resolve(process.cwd(), "env.example"), name: "env.example" },
  ];

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    return; // All good, .env exists
  }

  // Find which example file exists
  const existingExample = examplePaths.find((ex) => fs.existsSync(ex.path));

  if (existingExample) {
    console.log(
      chalk.yellow(`No .env file found, but ${existingExample.name} exists.`)
    );

    const response = await prompts({
      type: "confirm",
      name: "copy",
      message: `Create .env from ${existingExample.name}?`,
      initial: true,
    });

    if (response.copy) {
      try {
        fs.copyFileSync(existingExample.path, envPath);
        console.log(chalk.green(`Created .env from ${existingExample.name}`));
        console.log(
          chalk.blue(`Remember to update .env with your actual values!`)
        );
      } catch (error) {
        console.error(chalk.red(`Failed to create .env:`), error);
      }
    } else {
      console.log(
        chalk.yellow(
          "Skipping .env creation. The app may require environment variables."
        )
      );
    }
  }
}
