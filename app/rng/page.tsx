"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { SolanaWalletProvider } from "@/components/solana/wallet-provider";
import Link from "next/link";
import "@solana/wallet-adapter-react-ui/styles.css";

type Step = "connect" | "pay" | "verifying" | "result";

interface Invoice {
  memo: number;
  startTime: number;
  endTime: number;
  amount: number;
}

export default function RngPage() {
  return (
    <SolanaWalletProvider>
      <WalletModalProvider>
        <RngInner />
      </WalletModalProvider>
    </SolanaWalletProvider>
  );
}

function RngInner() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [step, setStep] = useState<Step>("connect");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Request invoice from server & sign payment
  const handlePay = useCallback(async () => {
    if (!publicKey || !signTransaction) return;

    setLoading(true);
    setError(null);

    try {
      // Build payment transaction on server
      const invoiceRes = await fetch("/api/rng/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWallet: publicKey.toBase58() }),
      });

      if (!invoiceRes.ok) {
        const data = await invoiceRes.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const { transaction: txBase64, invoice: inv } = await invoiceRes.json();
      setInvoice(inv);

      // Deserialize, sign, send
      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const signedTx = await signTransaction(tx);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );

      const latestBlockhash = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      // Step 2: Verify payment and get random number
      setStep("verifying");

      const verifyRes = await fetch("/api/rng/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          memo: inv.memo,
          startTime: inv.startTime,
          endTime: inv.endTime,
          amount: inv.amount,
        }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Verification failed");
      }

      const { number } = await verifyRes.json();
      setResult(number);
      setStep("result");
    } catch (err) {
      console.error("Payment flow error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("pay");
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  // Reset for another round
  const handleReset = () => {
    setStep("pay");
    setResult(null);
    setInvoice(null);
    setError(null);
  };

  // Track wallet connection state
  const currentStep = !connected ? "connect" : step === "connect" ? "pay" : step;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E14]">
      {/* Navbar */}
      <nav className="border-b border-[#5e6973]/20 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#9ffff5] to-[#7cffc4] text-sm font-bold text-[#0A0E14]">
              D
            </div>
            <span className="font-bold">DRIP</span>
          </Link>
          <WalletMultiButton />
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-[#5e6973]/20 bg-[#0F1419] p-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9ffff5]/10 to-[#7cffc4]/10 text-3xl">
                🎲
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white">
                Random Number Generator
              </h1>
              <p className="mt-2 text-sm text-[#6abea7]">
                Pay 0.1 SOL → Get a random number between 0 and 1000
              </p>
            </div>

            {/* Steps indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {["Connect", "Pay", "Result"].map((label, i) => {
                const stepMap: Step[] = ["connect", "pay", "result"];
                const stepIdx = stepMap.indexOf(currentStep === "verifying" ? "result" : currentStep);
                const isActive = i <= stepIdx;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-[#7cffc4] text-[#0A0E14]"
                          : "bg-[#5e6973]/30 text-[#5e6973]"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs ${
                        isActive ? "text-[#bdfffd]" : "text-[#5e6973]"
                      }`}
                    >
                      {label}
                    </span>
                    {i < 2 && (
                      <div
                        className={`h-px w-6 ${
                          i < stepIdx ? "bg-[#7cffc4]" : "bg-[#5e6973]/30"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-8">
              {/* Not connected */}
              {currentStep === "connect" && (
                <div className="text-center">
                  <p className="text-sm text-[#6abea7]">
                    Connect your Solana wallet to get started
                  </p>
                  <div className="mt-4 flex justify-center">
                    <WalletMultiButton />
                  </div>
                </div>
              )}

              {/* Ready to pay */}
              {currentStep === "pay" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#5e6973]/20 bg-[#0A0E14] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6abea7]">Price</span>
                      <span className="font-mono text-lg font-bold text-[#bdfffd]">
                        0.1 SOL
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-[#6abea7]">Wallet</span>
                      <span className="font-mono text-xs text-[#5e6973]">
                        {publicKey?.toBase58().slice(0, 4)}...
                        {publicKey?.toBase58().slice(-4)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-[#6abea7]">Output</span>
                      <span className="text-sm text-white">
                        Random number 0–1000
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-[#9ffff5] to-[#7cffc4] py-3 text-sm font-bold text-[#0A0E14] transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Signing transaction...
                      </span>
                    ) : (
                      "Pay 0.1 SOL & Generate"
                    )}
                  </button>
                </div>
              )}

              {/* Verifying */}
              {currentStep === "verifying" && (
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#5e6973]/30 border-t-[#7cffc4]" />
                  <p className="mt-4 text-sm text-[#6abea7]">
                    Verifying payment on-chain...
                  </p>
                  <p className="mt-1 text-xs text-[#5e6973]">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {/* Result */}
              {currentStep === "result" && result !== null && (
                <div className="space-y-4 text-center">
                  <div className="rounded-xl border border-[#7cffc4]/30 bg-[#7cffc4]/5 p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#6abea7]">
                      Your number
                    </div>
                    <div className="mt-2 font-mono text-6xl font-bold text-[#bdfffd]">
                      {result}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full rounded-xl border border-[#5e6973]/20 bg-[#0A0E14] py-3 text-sm font-medium text-[#6abea7] transition-colors hover:border-[#7cffc4]/30 hover:text-[#bdfffd]"
                  >
                    Generate Another (0.1 SOL)
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-4 text-center text-xs text-[#5e6973]">
            Powered by{" "}
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6abea7] hover:text-[#bdfffd]"
            >
              PumpFun
            </a>{" "}
            Agent Payments •{" "}
            <Link href="/" className="text-[#6abea7] hover:text-[#bdfffd]">
              drip.surf
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
