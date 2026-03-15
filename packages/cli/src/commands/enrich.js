import chalk from "chalk";
import ora from "ora";
import { personEnrich } from "../index.js";

export async function enrichCommand(identifier, options) {
  const isEmail = identifier.includes("@");
  const isLinkedIn = identifier.includes("linkedin.com");

  if (!isEmail && !isLinkedIn) {
    console.error(
      chalk.red("\n  Provide an email address or LinkedIn URL\n")
    );
    console.log(
      chalk.dim("  Examples:\n") +
        chalk.dim("    drip-agent enrich john@company.com\n") +
        chalk.dim(
          "    drip-agent enrich https://linkedin.com/in/johndoe\n"
        )
    );
    process.exit(1);
  }

  const spinner = ora({
    text: chalk.dim(`Enriching ${identifier}...`),
    color: "cyan",
  }).start();

  try {
    const params = isEmail
      ? { email: identifier }
      : { linkedinUrl: identifier };

    const data = await personEnrich(params);
    spinner.stop();

    if (options.format === "json") {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    const person = data?.person || data?.data?.person || data;

    if (!person || (typeof person === "object" && Object.keys(person).length === 0)) {
      console.log(chalk.yellow(`\n  No data found for ${identifier}\n`));
      return;
    }

    console.log("");
    console.log(
      chalk.cyan.bold(
        `  💧 ${person.first_name || ""} ${person.last_name || ""}`
      )
    );
    console.log(chalk.dim(`  ${"─".repeat(50)}`));

    if (person.title) {
      console.log(`\n  ${chalk.white(person.title)}`);
    }

    console.log("");

    const fields = [
      ["Company", person.organization?.name || person.organization_name],
      ["Email", person.email],
      ["Phone", person.phone_numbers?.[0]?.sanitized_number],
      ["Location", [person.city, person.state, person.country].filter(Boolean).join(", ")],
      ["LinkedIn", person.linkedin_url],
      ["Twitter", person.twitter_url],
      ["GitHub", person.github_url],
      ["Seniority", person.seniority],
      ["Department", person.departments?.join(", ")],
    ];

    for (const [label, value] of fields) {
      if (value) {
        console.log(`  ${chalk.dim(label.padEnd(14))} ${value}`);
      }
    }

    if (person.employment_history?.length > 0) {
      console.log(chalk.dim(`\n  Recent roles:`));
      for (const job of person.employment_history.slice(0, 3)) {
        const current = job.current ? chalk.green(" ●") : "";
        console.log(
          `  ${chalk.dim("·")} ${job.title} at ${job.organization_name}${current}`
        );
      }
    }

    console.log(chalk.dim(`\n  ${"─".repeat(50)}`));
    console.log(chalk.dim("  Powered by DRIP × AgentCash\n"));
  } catch (err) {
    spinner.stop();
    const msg = err.message || String(err);

    if (msg.includes("Insufficient balance") || msg.includes("balance")) {
      console.error(
        chalk.red("\n  Insufficient balance. Run: drip-agent balance\n")
      );
    } else if (msg.includes("wallet") || msg.includes("agentcash")) {
      console.error(
        chalk.red("\n  AgentCash not set up. Run: drip-agent setup\n")
      );
    } else {
      console.error(chalk.red(`\n  Enrichment failed: ${msg}\n`));
    }
    process.exit(1);
  }
}
