import { useEffect, useState } from "react";
import { Badge, Button } from "@figma/astraui";
import { Check, Copy } from "lucide-react";
import { docGroups, type DocBlock, type DocSection } from "./content";

// The docs are a view inside the same app, so `./` always resolves back to the
// landing page without depending on the deploy base path.
const HOME = "./";

function BusFactorMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" aria-hidden="true" focusable="false">
      <circle cx="11" cy="3.75" r="2.75" className="fill-brand-primary" />
      <path
        d="M11 10V26"
        className="stroke-current"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18.5" cy="19.5" r="6.5" className="stroke-current" strokeWidth="3.6" fill="none" />
    </svg>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      variant="subtle"
      size="small"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy command"}
      className="shrink-0 text-text-primary hover:text-text-secondary"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </Button>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-sm text-label-sm leading-relaxed text-text-secondary">{block.text}</p>;

    case "code":
      return (
        <div className="mt-lg flex items-center justify-between gap-md rounded-corner-md border border-border-secondary bg-bg-faint px-lg py-md">
          <code className="min-w-0 break-words font-mono text-label-sm text-text-primary">
            {block.code}
          </code>
          <CopyButton text={block.code} />
        </div>
      );

    case "steps":
      return (
        <ol className="mt-lg flex flex-col gap-lg">
          {block.items.map((item, index) => (
            <li key={item.title} className="flex gap-lg">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-corner-full bg-brand-primary text-label-sm font-semibold text-on-brand"
              >
                {index + 1}
              </span>
              <div>
                <p className="text-label font-medium text-text-primary">{item.title}</p>
                <p className="mt-xs text-label-sm leading-relaxed text-text-secondary">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "list":
      return (
        <ul className="mt-lg flex flex-col gap-sm pl-lg">
          {block.items.map((item) => (
            <li key={item} className="list-disc text-label-sm leading-relaxed text-text-secondary">
              {item}
            </li>
          ))}
        </ul>
      );

    case "note":
      return (
        <aside
          className={`mt-lg rounded-corner-md border px-lg py-md text-label-sm leading-relaxed ${
            block.tone === "warn"
              ? "border-warning bg-bg-subtle text-text-primary"
              : "border-border-selected bg-bg-subtle text-text-secondary"
          }`}
        >
          {block.text}
        </aside>
      );

    case "table":
      return (
        <div className="mt-lg overflow-x-auto">
          <table className="w-full border-collapse text-left text-label-sm">
            <thead>
              <tr className="border-b border-border-secondary">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="py-sm pr-lg font-medium text-text-primary">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border-secondary last:border-0">
                  {row.map((cell, index) => (
                    <td key={index} className="py-sm pr-lg align-top text-text-secondary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function SectionArticle({ section }: { section: DocSection }) {
  return (
    <article id={section.id} className="scroll-mt-xl border-b border-border-secondary pb-2xl last:border-0">
      <h3 className="text-heading font-medium text-text-primary">{section.title}</h3>
      {section.lead && <p className="mt-sm text-label leading-relaxed text-text-secondary">{section.lead}</p>}
      {section.blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </article>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = docGroups.flatMap((group) => group.sections.map((section) => section.id));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0 || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="docs-page min-h-screen bg-brand-tertiary font-sans text-text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-xl focus:top-xl focus:z-50 focus:rounded-corner-md focus:bg-brand-primary focus:px-lg focus:py-sm focus:text-on-brand"
      >
        Skip to content
      </a>

      <header className="border-b border-border-secondary">
        <div className="mx-auto flex w-full max-w-window items-center justify-between gap-lg px-xl py-lg md:px-2xl">
          <a href={HOME} className="flex items-center gap-sm" aria-label="BusFactor home">
            <BusFactorMark />
            <span className="font-display text-label font-semibold tracking-tight">BusFactor</span>
            <Badge label="Docs" variant="secondary" />
          </a>
          <a
            href={HOME}
            className="text-label-sm text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            Back to site
          </a>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-window flex-col gap-3xl px-xl py-2xl md:flex-row md:px-2xl md:py-3xl">
        <nav aria-label="Documentation sections" className="md:w-56 md:shrink-0">
          <div className="md:sticky md:top-xl">
            {docGroups.map((group) => (
              <div key={group.id} className="mb-xl">
                <p className="px-sm text-label-sm font-medium uppercase tracking-wide text-text-tertiary">
                  {group.label}
                </p>
                <ul className="mt-sm flex flex-col">
                  {group.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        aria-current={active === section.id ? "location" : undefined}
                        className={`block rounded-corner-sm px-sm py-xs text-label-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                          active === section.id
                            ? "bg-surface-hover text-text-primary"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <main id="main-content" className="min-w-0 flex-1">
          <div className="max-w-article">
            <p className="text-label-sm font-medium uppercase tracking-[0.18em] text-text-tertiary">
              Reference
            </p>
            <h1 className="type-display mt-md">BusFactor documentation</h1>
            <p className="mt-md text-label leading-relaxed text-text-secondary">
              Everything you need to run a scan and understand the result. Pick a tutorial to get
              started, or use the reference when you need an exact flag or limit.
            </p>
          </div>

          {docGroups.map((group) => (
            <section key={group.id} aria-labelledby={`${group.id}-title`} className="mt-3xl">
              <div className="flex items-center gap-md">
                <h2 id={`${group.id}-title`} className="text-heading font-medium text-text-primary">
                  {group.label}
                </h2>
              </div>
              <p className="mt-sm text-label-sm text-text-secondary">{group.description}</p>
              <div className="mt-xl flex flex-col gap-2xl">
                {group.sections.map((section) => (
                  <SectionArticle key={section.id} section={section} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      <footer className="border-t border-border-secondary">
        <div className="mx-auto flex w-full max-w-window flex-wrap items-center justify-between gap-md px-xl py-xl md:px-2xl">
          <span className="text-label-sm text-text-tertiary">
            BusFactor — operability for unfamiliar codebases.
          </span>
          <a href={HOME} className="text-label-sm text-text-secondary hover:text-text-primary">
            Back to site
          </a>
        </div>
      </footer>
    </div>
  );
}
