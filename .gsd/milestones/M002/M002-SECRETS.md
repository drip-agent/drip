# Secrets Manifest

**Milestone:** M002
**Generated:** 2026-03-15

### ANTHROPIC_API_KEY

**Service:** Anthropic (Claude API)
**Dashboard:** https://console.anthropic.com/settings/keys
**Format hint:** `sk-ant-...` (starts with `sk-ant-`)
**Status:** pending
**Destination:** dotenv

1. Go to https://console.anthropic.com/ and sign in (or create an account)
2. Navigate to Settings → API Keys
3. Click "Create Key", give it a name like "drip-agent"
4. Copy the key immediately (it won't be shown again)
5. The key starts with `sk-ant-api03-...`

### X402_PRIVATE_KEY

**Service:** AgentCash / Ethereum wallet (x402 payment signing)
**Dashboard:** n/a — derived from local AgentCash wallet
**Format hint:** `0x...` (64 hex chars, Ethereum private key format)
**Status:** pending
**Destination:** dotenv

1. If you have an AgentCash wallet, find it at `~/.agentcash/wallet.json`
2. Extract the `privateKey` field from the wallet JSON
3. The key is a hex string starting with `0x` (66 characters total)
4. If you don't have an AgentCash wallet, install AgentCash CLI: `npm install -g agentcash`
5. Run `agentcash wallet create` to generate a new wallet
6. Fund the wallet with USDC on Base network before using the agent
7. **CRITICAL:** This key controls funds. Never expose it to frontend code or commit it to git.

### KV_REST_API_URL

**Service:** Vercel KV (Upstash Redis)
**Dashboard:** https://vercel.com/dashboard/stores
**Format hint:** `https://...upstash.io` (HTTPS URL)
**Status:** pending
**Destination:** dotenv

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → KV (Upstash)
3. Name it "drip-feed" and select the region closest to your deployment
4. After creation, go to the store's Settings tab
5. Click "Show secret" next to `.env.local` and copy all KV_* variables
6. Vercel auto-provisions these env vars for deployed functions — for local dev, copy to `.env.local`

### KV_REST_API_TOKEN

**Service:** Vercel KV (Upstash Redis)
**Dashboard:** https://vercel.com/dashboard/stores
**Format hint:** `AX...` (Upstash token format)
**Status:** pending
**Destination:** dotenv

1. Same store as KV_REST_API_URL — provisioned together
2. Copy from the store's Settings → `.env.local` section

### CRON_SECRET

**Service:** Vercel Cron (endpoint authentication)
**Dashboard:** n/a — self-generated
**Format hint:** Any random string, 32+ characters recommended
**Status:** pending
**Destination:** dotenv

1. Generate a random secret: `openssl rand -hex 32`
2. Set as `CRON_SECRET` in both `.env.local` (local dev) and Vercel environment variables
3. Vercel automatically sends this as `Authorization: Bearer <CRON_SECRET>` to cron endpoints
4. The cron API route must validate this header to prevent unauthorized triggers
