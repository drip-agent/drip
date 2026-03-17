import Link from "next/link";

/* Shared documentation components */

export function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-dark-deepest px-1.5 py-0.5 font-mono text-xs text-soft-cyan">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  lang = "bash",
  title,
}: {
  children: string;
  lang?: string;
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ocean-mist/10 bg-dark-deepest">
      {title && (
        <div className="flex items-center gap-2 border-b border-ocean-mist/10 bg-dark-surface px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-aquamarine" />
          <span className="font-mono text-xs text-blue-slate">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-soft-cyan">
        {children}
      </pre>
    </div>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-heading text-xl font-bold text-white"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-base font-semibold text-soft-cyan">
      {children}
    </h3>
  );
}

export function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "tip" | "warn";
}) {
  const styles = {
    info: "border-soft-cyan/30 bg-soft-cyan/5",
    tip: "border-aquamarine/30 bg-aquamarine/5",
    warn: "border-amber-500/30 bg-amber-500/5",
  };
  const icons = { info: "💡", tip: "✅", warn: "⚠️" };
  return (
    <div className={`rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed text-ocean-mist ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

export function EndpointCard({
  method,
  path,
  description,
  cost,
}: {
  method: "GET" | "POST" | "GET, POST";
  path: string;
  description: string;
  cost: string;
}) {
  return (
    <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
      <div className="flex items-center gap-3">
        <span className="rounded bg-aquamarine/15 px-2 py-0.5 font-mono text-xs font-semibold text-aquamarine">
          {method}
        </span>
        <code className="font-mono text-sm text-icy-aqua">{path}</code>
        <span className="ml-auto text-xs text-blue-slate">{cost}</span>
      </div>
      <p className="mt-2 text-sm text-ocean-mist">{description}</p>
    </div>
  );
}

export function DocNav({
  prev,
  next,
}: {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-ocean-mist/10 pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
        >
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
        >
          {next.label} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
