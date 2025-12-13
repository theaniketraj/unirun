import prompts from "prompts";
import chalk from "chalk";
import detectPort from "detect-port";
import { execa } from "execa";

/**
 * Port Conflict Resolution
 * Detects if a specific port is in use and offers solutions
 */
export async function checkPortAvailability(
  desiredPort: number
): Promise<number> {
  try {
    const availablePort = await detectPort(desiredPort);

    if (availablePort === desiredPort) {
      // Port is available
      return desiredPort;
    }

    // Port is in use
    console.log(chalk.yellow(`Port ${desiredPort} is already in use.`));

    const response = await prompts({
      type: "select",
      name: "action",
      message: "What would you like to do?",
      choices: [
        {
          title: `Use port ${availablePort} instead`,
          value: "use-alternative",
        },
        { title: "Try to kill the process using the port", value: "kill" },
        { title: "Continue anyway (may fail)", value: "continue" },
      ],
      initial: 0,
    });

    if (response.action === "use-alternative") {
      console.log(chalk.green(`Using port ${availablePort} instead.`));
      return availablePort;
    } else if (response.action === "kill") {
      await killPortProcess(desiredPort);
      // Re-check if port is now available
      const recheckPort = await detectPort(desiredPort);
      if (recheckPort === desiredPort) {
        console.log(chalk.green(`Port ${desiredPort} is now available.`));
        return desiredPort;
      } else {
        console.log(
          chalk.yellow(
            `Port still in use. Using port ${availablePort} instead.`
          )
        );
        return availablePort;
      }
    } else {
      // Continue with the desired port anyway
      return desiredPort;
    }
  } catch (error) {
    console.error(chalk.red("Error checking port availability:"), error);
    return desiredPort;
  }
}

/**
 * Attempts to kill the process using a specific port
 */
async function killPortProcess(port: number): Promise<void> {
  try {
    const isWindows = process.platform === "win32";

    if (isWindows) {
      // Windows: Find and kill process using netstat
      console.log(chalk.blue(`Finding process on port ${port}...`));
      try {
        const { stdout } = await execa("netstat", ["-ano"]);
        const lines = stdout.split("\n");
        const portPattern = new RegExp(`:${port}\\s`, "i");

        for (const line of lines) {
          if (portPattern.test(line)) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];

            if (pid && !isNaN(Number(pid))) {
              console.log(chalk.blue(`Killing process ${pid}...`));
              await execa("taskkill", ["/F", "/PID", pid]);
              console.log(chalk.green(`Process killed successfully.`));
              return;
            }
          }
        }
        console.log(chalk.yellow(`No process found using port ${port}.`));
      } catch (error) {
        console.error(chalk.red(`Failed to kill process:`), error);
      }
    } else {
      // Unix-like: Use lsof
      console.log(chalk.blue(`Finding process on port ${port}...`));
      try {
        const { stdout } = await execa("lsof", ["-ti", `:${port}`]);
        const pid = stdout.trim();

        if (pid) {
          console.log(chalk.blue(`Killing process ${pid}...`));
          await execa("kill", ["-9", pid]);
          console.log(chalk.green(`Process killed successfully.`));
        } else {
          console.log(chalk.yellow(`No process found using port ${port}.`));
        }
      } catch (error) {
        console.error(chalk.red(`Failed to kill process:`), error);
      }
    }
  } catch (error) {
    console.error(chalk.red("Error killing port process:"), error);
    throw error;
  }
}

/**
 * Extracts port number from common development script patterns
 */
export function extractPortFromScript(script: string): number | null {
  // Match common port patterns: --port 3000, -p 3000, PORT=3000, port:3000
  const patterns = [
    /--port[=\s]+(\d+)/i,
    /-p[=\s]+(\d+)/i,
    /PORT[=\s]+(\d+)/i,
    /port[:\s]+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = script.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}
