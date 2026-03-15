import chalk from "chalk";
import { execSync } from "child_process";

export async function setupCommand(inviteCode) {
  console.log(chalk.cyan.bold("\n  💧 DRIP Agent Setup\n"));

  try {
    const cmd = inviteCode
      ? `npx agentcash@latest onboard ${inviteCode}`
      : `npx agentcash@latest onboard`;

    console.log(chalk.dim("  Setting up AgentCash wallet...\n"));

    execSync(cmd, {
      encoding: "utf-8",
      stdio: "inherit",
      timeout: 120_000,
    });

    console.log(chalk.green.bold("\n  ✓ Setup complete!\n"));
    console.log(chalk.dim("  Try it out:"));
    console.log(`    ${chalk.cyan("drip-agent research anthropic.com")}`);
    console.log(`    ${chalk.cyan("drip-agent enrich john@company.com")}`);
    console.log(`    ${chalk.cyan("drip-agent balance")}\n`);
  } catch (err) {
    console.error(chalk.red(`\n  Setup failed: ${err.message}\n`));
    process.exit(1);
  }
}
