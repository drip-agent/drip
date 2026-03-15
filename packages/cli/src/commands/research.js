import chalk from "chalk";
import ora from "ora";
import { companyResearch } from "../index.js";

export async function researchCommand(query, options) {
  // Normalize: if it looks like a domain, use directly; otherwise guess
  const domain = query.includes(".")
    ? query
    : `${query.toLowerCase().replace(/\s+/g, "")}.com`;

  const spinner = ora({
    text: chalk.dim(`Researching ${domain}...`),
    color: "cyan",
  }).start();

  try {
    const data = await companyResearch(domain);
    spinner.stop();

    if (options.format === "json") {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    // Extract org data — handle Apollo's response shape
    const org = data?.organization || data?.data?.organization || data;

    if (!org || (typeof org === "object" && Object.keys(org).length === 0)) {
      console.log(chalk.yellow(`\n  No data found for ${domain}\n`));
      return;
    }

    console.log("");
    console.log(chalk.cyan.bold(`  💧 ${org.name || domain}`));
    console.log(chalk.dim(`  ${"─".repeat(50)}`));

    if (org.short_description || org.description) {
      console.log(
        `\n  ${chalk.white(org.short_description || org.description)}`
      );
    }

    console.log("");

    const fields = [
      ["Industry", org.industry],
      ["Founded", org.founded_year],
      ["Employees", org.estimated_num_employees?.toLocaleString()],
      ["HQ", [org.city, org.state, org.country].filter(Boolean).join(", ")],
      ["Website", org.website_url || org.primary_domain],
      ["LinkedIn", org.linkedin_url],
      ["Funding", org.total_funding ? `$${(org.total_funding / 1_000_000).toFixed(1)}M` : null],
      ["Latest Round", org.latest_funding_round_type],
      ["Tech Stack", org.technologies?.slice(0, 5)?.join(", ")],
    ];

    for (const [label, value] of fields) {
      if (value) {
        console.log(`  ${chalk.dim(label.padEnd(14))} ${value}`);
      }
    }

    if (org.keywords?.length > 0) {
      console.log(
        `\n  ${chalk.dim("Tags")}          ${org.keywords.slice(0, 8).join(" · ")}`
      );
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
      console.error(chalk.red(`\n  Research failed: ${msg}\n`));
    }
    process.exit(1);
  }
}
