"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isToolUIPart,
  getToolName,
} from "ai";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

/** Simple markdown → HTML for assistant messages. */
function renderMarkdown(text: string): string {
  let html = text
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="my-3 rounded-card bg-dark-deepest/80 p-3 text-xs overflow-x-auto border border-ocean-mist/10"><code>$2</code></pre>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-dark-deepest/60 px-1.5 py-0.5 text-xs text-soft-cyan border border-ocean-mist/10">$1</code>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="mt-4 mb-1 text-sm font-semibold text-icy-aqua">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="mt-4 mb-1 text-base font-semibold text-icy-aqua">$1</h2>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-icy-aqua font-medium">$1</strong>'
    )
    .replace(
      /^[-*] (.+)$/gm,
      '<li class="ml-4 list-disc text-ocean-mist">$1</li>'
    )
    .replace(
      /((?:<li[^>]*>.*?<\/li>\n?)+)/g,
      '<ul class="my-2 space-y-0.5">$1</ul>'
    )
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, "<br/>");

  return `<p>${html}</p>`;
}

/** Friendly tool name for display */
function formatToolName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SUGGESTIONS = [
  { label: "Research Anthropic", prompt: "Research Anthropic" },
  { label: "Look up Coinbase", prompt: "Look up Coinbase" },
  { label: "Find a company", prompt: "Tell me about OpenAI" },
];

/** Payment flow phases for status indicators */
type PaymentPhase =
  | "idle"
  | "creating-invoice"
  | "awaiting-signature"
  | "submitting-tx"
  | "verifying"
  | "sending"
  | "error";

const PHASE_LABELS: Record<PaymentPhase, string> = {
  idle: "",
  "creating-invoice": "Building invoice…",
  "awaiting-signature": "Sign transaction in wallet…",
  "submitting-tx": "Submitting transaction…",
  verifying: "Verifying payment…",
  sending: "Sending message…",
  error: "Payment failed",
};

/** Payment status indicator shown during the signing flow */
function PaymentStatus({
  phase,
  errorMessage,
}: {
  phase: PaymentPhase;
  errorMessage?: string;
}) {
  if (phase === "idle") return null;

  const isError = phase === "error";
  const label = isError && errorMessage ? errorMessage : PHASE_LABELS[phase];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-card px-4 py-2.5 mb-3",
        "border text-sm",
        isError
          ? "border-amber-400/30 bg-amber-400/5 text-amber-400"
          : "border-icy-aqua/20 bg-dark-elevated text-ocean-mist"
      )}
    >
      {!isError && (
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-aquamarine" />
      )}
      {isError && <span>⚠</span>}
      <span>{label}</span>
    </div>
  );
}

export default function AgentChatPage() {
  const [input, setInput] = useState("");
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");
  const [paymentError, setPaymentError] = useState<string>();

  // Solana wallet + connection from provider
  const { publicKey, connected, signTransaction, connect } = useWallet();
  const { connection } = useConnection();

  // Ref for dynamically injecting the x-payment-invoice header per request.
  // The transport reads this via a header function on each sendMessage call.
  const invoiceRef = useRef<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        headers: () => {
          const headers: Record<string, string> = {};
          if (invoiceRef.current) {
            headers["x-payment-invoice"] = invoiceRef.current;
          }
          return headers;
        },
      }),
    []
  );

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport,
    onError: (err) => {
      console.error(`[agent-chat] Chat error: ${err.message}`, err);
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isReady = status === "ready";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Execute the full payment flow:
   * 1. Create invoice via POST /api/agent/payment
   * 2. Deserialize + sign transaction with wallet
   * 3. Send raw transaction to Solana
   * 4. Verify payment via POST /api/agent/payment/verify
   * 5. Return invoiceId on success
   *
   * Logs each phase with [solana-payment] prefix for observability.
   */
  const executePaymentFlow = useCallback(async (): Promise<string | null> => {
    if (!publicKey || !signTransaction) {
      console.error("[solana-payment] Wallet not connected or missing signTransaction");
      return null;
    }

    const startTime = performance.now();

    // Step 1: Create invoice
    setPaymentPhase("creating-invoice");
    console.log("[solana-payment] Creating invoice…");

    let invoiceId: string;
    let serializedTransaction: string;
    try {
      const res = await fetch("/api/agent/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_query",
          userPublicKey: publicKey.toBase58(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error || `Invoice creation failed (${res.status})`);
      }

      const data = await res.json();
      invoiceId = data.invoiceId;
      serializedTransaction = data.serializedTransaction;
      console.log(
        `[solana-payment] Invoice created: ${invoiceId} (${data.amount} ${data.currency})`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[solana-payment] Invoice creation failed: ${msg}`);
      setPaymentPhase("error");
      setPaymentError(`Failed to create invoice: ${msg}`);
      return null;
    }

    // Step 2: Deserialize and sign transaction
    setPaymentPhase("awaiting-signature");
    console.log("[solana-payment] Awaiting wallet signature…");

    let signedTransaction: Transaction;
    try {
      const txBuffer = Buffer.from(serializedTransaction, "base64");
      const transaction = Transaction.from(txBuffer);
      signedTransaction = await signTransaction(transaction);
      console.log("[solana-payment] Transaction signed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // User likely rejected the transaction
      const isRejection =
        msg.includes("rejected") ||
        msg.includes("cancelled") ||
        msg.includes("canceled") ||
        msg.includes("denied") ||
        msg.includes("User rejected");
      console.warn(`[solana-payment] Signing failed: ${msg}`);
      setPaymentPhase("error");
      setPaymentError(
        isRejection ? "Transaction cancelled" : `Signing failed: ${msg}`
      );
      return null;
    }

    // Step 3: Send signed transaction to Solana
    setPaymentPhase("submitting-tx");
    console.log("[solana-payment] Submitting transaction to Solana…");

    let txSignature: string;
    try {
      txSignature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      console.log(
        `[solana-payment] Transaction submitted: ${txSignature.slice(0, 16)}…`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[solana-payment] Transaction submission failed: ${msg}`);
      setPaymentPhase("error");
      setPaymentError(`Transaction failed: ${msg}`);
      return null;
    }

    // Step 4: Verify payment
    setPaymentPhase("verifying");
    console.log(`[solana-payment] Verifying payment for invoice ${invoiceId}…`);

    try {
      const res = await fetch("/api/agent/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, txSignature }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(
          data.error || `Verification failed (${res.status})`
        );
      }

      const data = await res.json();
      if (!data.verified) {
        throw new Error("Payment could not be verified on-chain");
      }

      const elapsed = Math.round(performance.now() - startTime);
      console.log(
        `[solana-payment] Payment verified: invoice=${invoiceId}, ` +
          `tx=${txSignature.slice(0, 16)}…, elapsed=${elapsed}ms`
      );
      return invoiceId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[solana-payment] Verification failed: ${msg}`);
      setPaymentPhase("error");
      setPaymentError(`Payment verification failed: ${msg}`);
      return null;
    }
  }, [publicKey, signTransaction, connection]);

  // Whether payment is required (token mint configured)
  const paymentRequired = !!process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !isReady) return;

    const messageText = input;
    setInput("");
    setPaymentError(undefined);

    if (paymentRequired) {
      // Check wallet connection
      if (!connected) {
        try {
          await connect();
        } catch {
          setPaymentPhase("error");
          setPaymentError("Connect your Solana wallet to send messages");
          return;
        }
        // If still not connected after attempt, show error
        if (!publicKey) {
          setPaymentPhase("error");
          setPaymentError("Connect your Solana wallet to send messages");
          return;
        }
      }

      // Execute payment flow
      const invoiceId = await executePaymentFlow();
      if (!invoiceId) {
        // Error state already set by executePaymentFlow
        return;
      }

      // Set the invoice header for this request
      invoiceRef.current = invoiceId;
      setPaymentPhase("sending");
    }

    try {
      sendMessage({ text: messageText });
      if (paymentRequired) {
        console.log(
          `[solana-payment] Message sent with invoice ${invoiceRef.current}`
        );
      }
    } finally {
      // Clear the invoice ref after sending
      // The transport has already read the header by this point
      setTimeout(() => {
        invoiceRef.current = null;
        setPaymentPhase("idle");
      }, 100);
    }
  }

  function handleSuggestion(prompt: string) {
    if (!isReady) return;
    // Set the input and let the user click send (which triggers payment flow)
    setInput(prompt);
    inputRef.current?.focus();
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Empty state */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-2 text-4xl">💧</div>
              <h1 className="mb-1 font-heading text-xl font-semibold text-icy-aqua">
                DRIP Agent
              </h1>
              <p className="mb-8 text-center text-sm text-ocean-mist">
                Real-time company &amp; people intelligence. Ask me anything.
              </p>

              {/* Wallet connection prompt */}
              {paymentRequired && !connected && (
                <p className="mb-6 text-center text-xs text-blue-slate">
                  Connect your Solana wallet to start chatting (payment
                  required per query)
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.prompt}
                    type="button"
                    onClick={() => handleSuggestion(s.prompt)}
                    className={cn(
                      "rounded-button border border-ocean-mist/20 bg-dark-elevated px-4 py-2",
                      "text-sm text-ocean-mist transition-all",
                      "hover:border-icy-aqua/30 hover:text-icy-aqua hover:shadow-glow-sm"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" && (
                <div className="flex justify-end">
                  <div
                    className={cn(
                      "max-w-[80%] rounded-card px-4 py-2.5",
                      "bg-aquamarine/15 text-sm text-icy-aqua",
                      "border border-aquamarine/20"
                    )}
                  >
                    {message.parts
                      .filter(
                        (part): part is Extract<typeof part, { type: "text" }> =>
                          part.type === "text"
                      )
                      .map((part, i) => (
                        <span key={i}>{part.text}</span>
                      ))}
                  </div>
                </div>
              )}

              {message.role === "assistant" && (
                <div className="flex justify-start">
                  <GlassPanel
                    blur="sm"
                    className={cn(
                      "max-w-[85%] !p-4 text-sm text-ocean-mist",
                      "border-ocean-mist/10"
                    )}
                  >
                    {message.parts.map((part, i) => {
                      if (isToolUIPart(part)) {
                        const name = getToolName(part);
                        const isDone = part.state === "output-available";
                        return (
                          <div
                            key={`tool-${i}`}
                            className={cn(
                              "mb-3 flex items-center gap-2 rounded-button px-3 py-1.5",
                              "bg-dark-deepest/60 text-xs border border-ocean-mist/10",
                              isDone ? "text-soft-cyan" : "text-ocean-mist"
                            )}
                          >
                            {!isDone ? (
                              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-aquamarine" />
                            ) : (
                              <span className="text-aquamarine">✓</span>
                            )}
                            <span>
                              {!isDone
                                ? "Researching..."
                                : formatToolName(name)}
                            </span>
                          </div>
                        );
                      }

                      if (part.type === "text" && part.text) {
                        return (
                          <div
                            key={`text-${i}`}
                            className="prose-drip leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(part.text),
                            }}
                          />
                        );
                      }

                      return null;
                    })}
                  </GlassPanel>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-card bg-dark-elevated px-4 py-3 border border-ocean-mist/10">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-icy-aqua [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-soft-cyan [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aquamarine [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-ocean-mist">Thinking...</span>
              </div>
            </div>
          )}

          {/* Error banner */}
          {status === "error" && (
            <div
              className={cn(
                "flex items-center justify-between gap-3",
                "rounded-card border border-icy-aqua/20 bg-dark-elevated px-4 py-3"
              )}
            >
              <span className="text-sm text-ocean-mist">
                Lost signal. Try again.
              </span>
              <button
                type="button"
                onClick={() => regenerate()}
                className={cn(
                  "shrink-0 rounded-button border border-icy-aqua/30 px-3 py-1.5",
                  "text-xs font-medium text-icy-aqua",
                  "transition-colors hover:bg-icy-aqua/10"
                )}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-ocean-mist/10 bg-dark-surface/80 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Payment status indicator */}
          <PaymentStatus phase={paymentPhase} errorMessage={paymentError} />

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                !paymentRequired || connected
                  ? "Ask DRIP anything…"
                  : "Connect wallet to start…"
              }
              disabled={!isReady || paymentPhase !== "idle"}
              className={cn(
                "flex-1 rounded-button border border-ocean-mist/30 bg-dark-deepest px-4 py-2.5",
                "text-sm text-icy-aqua placeholder:text-blue-slate",
                "transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-icy-aqua/40 focus:border-icy-aqua/50",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            {status === "streaming" || status === "submitted" ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => stop()}
              >
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={
                  !isReady || !input.trim() || paymentPhase !== "idle"
                }
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
