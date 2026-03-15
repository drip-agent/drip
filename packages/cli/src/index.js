import { execSync } from "child_process";

const STABLEENRICH = "https://stableenrich.dev";

/**
 * Make a paid API call via AgentCash CLI.
 * Returns parsed JSON response.
 */
export function agentcashFetch(url, method = "GET", body = null) {
  const args = [`npx agentcash@latest fetch '${url}'`, `-m ${method}`, `--format json`];
  if (body) {
    args.push(`-b '${JSON.stringify(body)}'`);
  }

  const output = execSync(args.join(" "), {
    encoding: "utf-8",
    timeout: 60_000,
    stdio: ["pipe", "pipe", "pipe"],
  });

  return JSON.parse(output.trim());
}

/**
 * Research a company via StableEnrich Apollo org enrichment.
 */
export async function companyResearch(domain) {
  return agentcashFetch(
    `${STABLEENRICH}/api/apollo/org-enrich`,
    "POST",
    { domain }
  );
}

/**
 * Enrich a person via StableEnrich Apollo people enrichment.
 */
export async function personEnrich({ email, linkedinUrl }) {
  const body = {};
  if (email) body.email = email;
  if (linkedinUrl) body.linkedin_url = linkedinUrl;

  return agentcashFetch(
    `${STABLEENRICH}/api/apollo/people-enrich`,
    "POST",
    body
  );
}
