#!/usr/bin/env node

import { createRequire } from "module";
import { program } from "commander";
import { researchCommand } from "../src/commands/research.js";
import { enrichCommand } from "../src/commands/enrich.js";
import { setupCommand } from "../src/commands/setup.js";
import { balanceCommand } from "../src/commands/balance.js";
import { interactiveMode } from "../src/interactive.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

program
  .name("drip-agent")
  .description("DRIP — autonomous research intelligence from the terminal")
  .version(pkg.version);

program
  .command("research <query>")
  .description("Research a company by domain or name")
  .option("-f, --format <type>", "Output format: text, json, markdown", "text")
  .action(researchCommand);

program
  .command("enrich <identifier>")
  .description("Enrich a person by email or LinkedIn URL")
  .option("-f, --format <type>", "Output format: text, json, markdown", "text")
  .action(enrichCommand);

program
  .command("setup [invite-code]")
  .description("Set up AgentCash wallet for paid API access")
  .action(setupCommand);

program
  .command("balance")
  .description("Check your AgentCash wallet balance")
  .action(balanceCommand);

// No arguments → interactive mode
if (process.argv.length <= 2) {
  interactiveMode();
} else {
  program.parse();
}
