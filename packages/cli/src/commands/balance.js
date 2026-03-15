import { execSync } from "child_process";
import chalk from "chalk";

export async function balanceCommand() {
  try {
    const out = execSync("npx agentcash@latest wallet info", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const data = JSON.parse(out);
    if (data.success) {
      const w = data.data;
      console.log(chalk.cyan.bold("\n  💧 DRIP Wallet\n"));
      console.log(`  Address:  ${chalk.dim(w.address)}`);
      console.log(`  Balance:  ${chalk.green.bold("$" + w.balance)} USDC`);
      if (w.chains) {
        for (const c of w.chains) {
          console.log(`            ${chalk.dim(c.paymentNetwork)}: $${c.balance}`);
        }
      }
      console.log(`\n  Deposit:  ${chalk.underline(w.depositLink)}\n`);
    } else {
      console.log(out);
    }
  } catch {
    console.error(chalk.red("No wallet found. Run: drip-agent setup"));
  }
}
