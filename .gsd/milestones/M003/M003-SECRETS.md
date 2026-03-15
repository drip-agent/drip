# Secrets Manifest

**Milestone:** M003
**Generated:** 2026-03-15

### SOLANA_RPC_URL

**Service:** Solana RPC Provider (Helius, Alchemy, or Ankr)
**Dashboard:** https://dashboard.helius.dev/
**Format hint:** `https://mainnet.helius-rpc.com/?api-key=...` or `https://rpc.ankr.com/solana/...`
**Status:** pending
**Destination:** dotenv

1. Go to https://dashboard.helius.dev/ (or your preferred Solana RPC provider)
2. Create a free account and a new project
3. Copy the mainnet RPC URL — it must support `sendTransaction` (public RPC does not)
4. The URL should include your API key as a query parameter or path segment

### SOLANA_PRIVATE_KEY

**Service:** Solana Wallet (agent's payment-receiving keypair)
**Dashboard:** N/A — generated locally via `solana-keygen` or exported from Phantom
**Format hint:** Base58 string (44-88 characters) or JSON byte array `[1,2,3,...]`
**Status:** pending
**Destination:** dotenv

1. Generate a new Solana keypair: `solana-keygen new --outfile ~/.config/solana/drip-agent.json`
2. Or export an existing wallet's private key from Phantom (Settings → Security → Export Private Key)
3. Copy the base58 private key string
4. This wallet receives user payments and must be funded with a small amount of SOL for transaction fees
5. The public key of this wallet is used as the agent's payment address in PumpFun invoice creation
