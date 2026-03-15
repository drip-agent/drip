import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import { researchCommand } from "./commands/research.js";
import { enrichCommand } from "./commands/enrich.js";
import { setupCommand } from "./commands/setup.js";
import { balanceCommand } from "./commands/balance.js";

export async function interactiveMode() {
  console.log(
    chalk.cyan.bold("\n  💧 DRIP") +
      chalk.dim(" — autonomous research intelligence\n")
  );

  const action = await select({
    message: "What do you want to do?",
    choices: [
      {
        name: "🔍 Research a company",
        value: "research",
        description: "Look up company intel by domain or name (~$0.05)",
      },
      {
        name: "👤 Enrich a person",
        value: "enrich",
        description: "Find profile data by email or LinkedIn (~$0.05)",
      },
      {
        name: "💰 Check balance",
        value: "balance",
        description: "View your AgentCash wallet balance",
      },
      {
        name: "⚙️  Set up wallet",
        value: "setup",
        description: "Configure AgentCash for paid API access",
      },
    ],
  });

  switch (action) {
    case "research": {
      const query = await input({
        message: "Company domain or name:",
        required: true,
        validate: (v) => (v.trim() ? true : "Enter a company domain or name"),
      });
      await researchCommand(query, { format: "text" });
      break;
    }

    case "enrich": {
      const identifier = await input({
        message: "Email or LinkedIn URL:",
        required: true,
        validate: (v) => {
          const s = v.trim();
          if (!s) return "Enter an email or LinkedIn URL";
          if (!s.includes("@") && !s.includes("linkedin.com"))
            return "Enter a valid email or LinkedIn URL";
          return true;
        },
      });
      await enrichCommand(identifier, { format: "text" });
      break;
    }

    case "balance":
      await balanceCommand();
      break;

    case "setup": {
      const code = await input({
        message: "Invite code (leave empty to skip):",
      });
      await setupCommand(code || undefined);
      break;
    }
  }

  // Ask if they want to continue
  console.log("");
  const again = await select({
    message: "Continue?",
    choices: [
      { name: "Yes — do something else", value: true },
      { name: "No — exit", value: false },
    ],
  });

  if (again) {
    await interactiveMode();
  } else {
    console.log(chalk.dim("\n  drip.surf · $DRIP\n"));
  }
}
