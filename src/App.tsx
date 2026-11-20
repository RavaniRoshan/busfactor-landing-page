import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  Badge,
  Button,
  IconButton,
  SecondaryNavItem,
  Tabs,
  Toolbar,
  ToolbarItem,
  Tooltip,
  useTheme,
} from "@figma/astraui";
import {
  Archive,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  FileCode2,
  FileText,
  Gauge,
  Globe,
  KeyRound,
  Link as LinkIcon,
  Lock,
  Map as MapIcon,
  Moon,
  Plug,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Workflow,
  type LucideProps,
} from "lucide-react";
import duskRoad from "./assets/dusk-road.webp";
import { gsap } from "./animations/gsap";
import { useMotionGsap } from "./animations/useMotionGsap";
import { usePageAnimations } from "./animations/usePageAnimations";

const LOCAL_COMMAND = "npx busfactor scan ./my-repo";
const GITHUB_COMMAND = "npx busfactor scan https://github.com/owner/repo";
const CLI_COMMAND = "busfactor scan <path|url> --out <dir> --format md,json --fail-under <score>";
const MCP_COMMAND = "node packages/mcp/dist/index.js";
const SKILL_PATH = "skills/handoff/SKILL.md";

type Icon = ComponentType<LucideProps>;

/* ------------------------------------------------------------------ */
/* Clipboard                                                           */
/* ------------------------------------------------------------------ */

type ClipboardState = {
  copied: string | null;
  copy: (text: string) => void;
};

const ClipboardContext = createContext<ClipboardState>({ copied: null, copy: () => {} });

function ClipboardProvider({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    let ok = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // Restricted contexts reject the async API; fall back to a selection copy.
      }
    }
    if (!ok) {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.className = "fixed opacity-0 pointer-events-none";
      document.body.appendChild(field);
      field.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      field.remove();
    }

    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopied(text);
      setMessage(`Copied ${text}`);
    } else {
      setCopied(null);
      setMessage("Copy failed. Select the text and copy it manually.");
    }
    timer.current = setTimeout(() => {
      setCopied(null);
      setMessage("");
    }, 2000);
  }, []);

  return (
    <ClipboardContext.Provider value={{ copied, copy }}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </ClipboardContext.Provider>
  );
}

function CopyButton({
  text,
  children,
  variant = "neutral",
  size = "small",
  className,
}: {
  text: string;
  children: ReactNode;
  variant?: "primary" | "neutral" | "subtle";
  size?: "medium" | "small";
  className?: string;
}) {
  const { copied, copy } = useContext(ClipboardContext);
  const isCopied = copied === text;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      iconStart={isCopied ? <Check size={16} /> : <Copy size={16} />}
      onClick={() => copy(text)}
      aria-label={`Copy ${text}`}
    >
      {isCopied ? "Copied" : children}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

/*
 * The BusFactor mark: a lowercase "b" whose ascender has broken away into a
 * separate dot — the knowledge that leaves with a repository's author.
 * Like AstraLogo, it draws with design-system color variables.
 */
function BusFactorMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="11" cy="3.75" r="2.75" className="fill-brand-primary" />
      <path
        d="M11 10V26"
        className="stroke-current"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="18.5"
        cy="19.5"
        r="6.5"
        className="stroke-current"
        strokeWidth="3.6"
        fill="none"
      />
    </svg>
  );
}

/* Official Claude mark (coral), used wherever Claude Code is mentioned. */
function ClaudeLogo({ size = 24, className = "" }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="#D97757"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

function Logo({ className = "text-text-primary" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-sm ${className}`}>
      <BusFactorMark className="size-6" />
      <span className="font-display text-label font-semibold tracking-tight">BusFactor</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Heading({
  level,
  id,
  className = "",
  children,
}: {
  level: 1 | 2 | 3;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="heading" aria-level={level} id={id} className={`text-text-primary ${className}`}>
      {children}
    </div>
  );
}

function Section({
  id,
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-page scroll-mt-xl px-xl py-4xl md:px-2xl md:py-section ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  id,
  title,
  text,
  badge,
}: {
  id: string;
  title: string;
  text: string;
  badge?: string;
}) {
  return (
    <div
      data-anim="section-header"
      className="mx-auto flex max-w-copy flex-col items-center gap-md text-center"
    >
      {badge && <Badge label={badge} variant="secondary" />}
      <Heading level={2} id={id} className="type-display">
        {title}
      </Heading>
      <p className="text-label text-text-secondary">{text}</p>
    </div>
  );
}

function Cite({ children }: { children: ReactNode }) {
  return (
    <code className="inline-flex items-center rounded-corner-sm bg-bg-subtle px-sm py-xs font-mono text-video-title text-text-secondary">
      {children}
    </code>
  );
}

function scrollToSection(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Tooltip content={`Switch to ${next} mode`} position="left">
      <IconButton
        variant="subtle"
        size="small"
        icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        onClick={toggleTheme}
        aria-label={`Switch to ${next} mode`}
      />
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/* Report window (the product showcase)                                */
/* ------------------------------------------------------------------ */

const reportViews: { id: ReportView; label: string; icon: Icon }[] = [
  { id: "verdict", label: "Verdict", icon: Gauge },
  { id: "risks", label: "Risk map", icon: MapIcon },
  { id: "operate", label: "OPERATE.md", icon: FileText },
  { id: "questions", label: "Author questions", icon: CircleHelp },
];

type ReportView = "verdict" | "risks" | "operate" | "questions";

function ViewHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-xs">
      <p className="text-video-title uppercase tracking-widest text-text-secondary">{eyebrow}</p>
      <Heading level={3} className="text-heading font-semibold">
        {title}
      </Heading>
      <p className="mt-xs text-label-sm text-text-secondary">{text}</p>
    </div>
  );
}

function OperateView() {
  const steps = [
    {
      title: "Start it locally",
      body: "Install dependencies, copy .env.example to .env, then run the dev server. It listens on port 4000.",
      cite: "README.md:23",
    },
    {
      title: "Deploy",
      body: "Deploys run from main through one script that builds the image, runs migrations, and swaps containers.",
      cite: "scripts/deploy.sh:42",
    },
    {
      title: "Roll back",
      body: "Redeploy the previous image tag. Migrations are forward-only, so schema changes cannot be undone.",
      cite: "db/migrations/README.md:8",
    },
  ];

  return (
    <div className="flex flex-col gap-xl">
      <ViewHeader
        eyebrow="OPERATE.md"
        title="Operating acme/payments-api"
        text="Drafted from repository evidence. Anything the code cannot confirm is marked unknown."
      />
      <ol className="flex flex-col gap-xl">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-lg">
            <span className="font-mono text-label-sm text-text-tertiary">0{index + 1}</span>
            <div className="flex flex-col items-start gap-sm">
              <p className="text-label font-medium text-text-primary">{step.title}</p>
              <p className="text-label-sm text-text-secondary">{step.body}</p>
              <Cite>{step.cite}</Cite>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col items-start gap-sm rounded-corner-md bg-bg-faint p-lg">
        <Badge label="Unknown" variant="warning" />
        <p className="text-label-sm text-text-primary">
          Who rotates STRIPE_WEBHOOK_SECRET, and how often?
        </p>
        <Cite>config/secrets.ts:18</Cite>
      </div>
    </div>
  );
}

function VerdictView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const findings: {
    label: string;
    status: string;
    variant: "success" | "warning" | "danger";
    cite: string;
  }[] = [
    { label: "Can start the service", status: "Yes", variant: "success", cite: "README.md:23" },
    { label: "Can deploy safely", status: "Yes", variant: "success", cite: "scripts/deploy.sh:42" },
    {
      label: "Can recover from a bad deploy",
      status: "Partly",
      variant: "warning",
      cite: "db/migrations/README.md:8",
    },
    { label: "Can rotate secrets", status: "No", variant: "danger", cite: "config/secrets.ts:18" },
  ];

  // Runs each time this view mounts (i.e. when it becomes the active tab).
  useMotionGsap(() => {
    const score = scoreRef.current;
    if (score) {
      // Read the target from a data attribute, not textContent: React.StrictMode
      // double-mounts effects in dev, and the first pass mutates textContent to
      // "0", so re-reading it would corrupt the target to 0.
      const target = Number(score.dataset.score) || 0;
      const counter = { value: 0 };
      score.textContent = "0";
      gsap.to(counter, {
        value: target,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          score.textContent = String(Math.round(counter.value));
        },
      });
    }

    const rows = gsap.utils.toArray<HTMLElement>('[data-anim="finding"]', rootRef.current);
    if (rows.length > 0) {
      gsap.from(rows, {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
    }
  }, rootRef);

  return (
    <div ref={rootRef} className="flex flex-col gap-xl">
      <ViewHeader
        eyebrow="Operability verdict"
        title="Operable, with gaps"
        text="A newcomer can run and deploy this service, but cannot safely recover or rotate secrets without the original author."
      />
      <div className="flex items-baseline gap-sm">
        <span ref={scoreRef} data-score="64" className="type-display text-text-primary">
          64
        </span>
        <span className="text-label text-text-secondary">/ 100</span>
      </div>
      <ul className="flex flex-col divide-y divide-border-secondary">
        {findings.map((finding) => (
          <li
            key={finding.label}
            data-anim="finding"
            className="flex flex-wrap items-center justify-between gap-md py-lg"
          >
            <div className="flex flex-col items-start gap-xs">
              <p className="text-label-sm text-text-primary">{finding.label}</p>
              <Cite>{finding.cite}</Cite>
            </div>
            <Badge label={finding.status} variant={finding.variant} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RisksView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dimensions = [
    { name: "Setup", value: 90 },
    { name: "Configuration", value: 70 },
    { name: "Deployment", value: 80 },
    { name: "Observability", value: 55 },
    { name: "Recovery", value: 35 },
    { name: "Secrets", value: 25 },
    { name: "Ownership", value: 60 },
  ];

  // Bars grow from the left with a transform so no layout property animates.
  useMotionGsap(() => {
    const fills = gsap.utils.toArray<HTMLElement>('[data-anim="risk-fill"]', rootRef.current);
    if (fills.length === 0) return;
    gsap.from(fills, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    });
  }, rootRef);

  return (
    <div ref={rootRef} className="flex flex-col gap-xl">
      <ViewHeader
        eyebrow="Risk map"
        title="Where a handoff breaks first"
        text="Seven dimensions, scored by code. Lower bars mark where a new operator is most likely to get stuck."
      />
      <ul className="flex flex-col gap-lg">
        {dimensions.map((dimension) => (
          <li key={dimension.name} className="grid grid-cols-3 items-center gap-lg">
            <span className="text-label-sm text-text-secondary">{dimension.name}</span>
            <div
              className="col-span-2 h-xs overflow-hidden rounded-corner-full bg-bg-subtle"
              role="img"
              aria-label={`${dimension.name}: ${dimension.value} percent`}
            >
              <div
                data-anim="risk-fill"
                className={`h-full rounded-corner-full ${
                  dimension.value < 50 ? "bg-warning" : "bg-brand-primary"
                }`}
                style={{ width: `${dimension.value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionsView() {
  const questions = [
    {
      question: "Who rotates STRIPE_WEBHOOK_SECRET, and how often?",
      why: "The secret is read at boot, but nothing in the repo sets or rotates it.",
      cite: "config/secrets.ts:18",
    },
    {
      question: "Is the nightly reconciliation job safe to re-run after a failure?",
      why: "The job writes to the ledger without an idempotency key.",
      cite: "jobs/reconcile.ts:61",
    },
    {
      question: "Which alerts page a human, and who receives them?",
      why: "Alert rules exist, but no routing or on-call config is checked in.",
      cite: "ops/alerts.yml:4",
    },
  ];

  return (
    <div className="flex flex-col gap-xl">
      <ViewHeader
        eyebrow="Author questions"
        title="Only the original author can answer"
        text="The scan stops where the evidence does, and writes down what is missing."
      />
      <ul className="flex flex-col gap-md">
        {questions.map((item) => (
          <li
            key={item.question}
            className="flex flex-col items-start gap-sm rounded-corner-md bg-bg-faint p-lg"
          >
            <p className="text-label-sm font-medium text-text-primary">{item.question}</p>
            <p className="text-video-title text-text-secondary">{item.why}</p>
            <Cite>{item.cite}</Cite>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportWindow() {
  const [view, setView] = useState<ReportView>("operate");
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Reveal the panel body whenever the active view changes, but not on the very
  // first render — the showcase entrance already reveals the whole window.
  useMotionGsap(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      const content = rootRef.current?.querySelector<HTMLElement>('[data-anim="report-content"]');
      if (!content) return;
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
    },
    rootRef,
    [view],
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-window overflow-hidden rounded-corner-lg border border-border-primary bg-surface-bg"
    >
      <div className="flex items-center justify-between gap-lg border-b border-border-secondary px-xl py-lg">
        <div className="flex min-w-0 items-center gap-md text-text-primary">
          <BusFactorMark className="size-6 shrink-0" />
          <span className="truncate font-mono text-label-sm">acme/payments-api</span>
          <span className="hidden sm:inline-flex">
            <Badge label="Example report" variant="secondary" />
          </span>
        </div>
        <span className="shrink-0 text-label-sm text-text-secondary">
          Score <span className="font-mono text-text-primary">64/100</span>
        </span>
      </div>

      <div className="grid min-h-report lg:grid-cols-4">
        <nav
          aria-label="Report sections"
          className="hidden flex-col gap-xs border-r border-border-secondary p-lg lg:flex"
        >
          {reportViews.map(({ id, label, icon: ViewIcon }) => (
            <SecondaryNavItem
              key={id}
              icon={<ViewIcon className="size-full" strokeWidth={1.5} />}
              label={label}
              active={view === id}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            />
          ))}
        </nav>

        <div className="relative lg:col-span-3">
          <div
            data-anim="report-content"
            className="mx-auto w-full max-w-copy px-xl pb-section pt-2xl md:px-2xl"
          >
            {view === "verdict" && <VerdictView />}
            {view === "risks" && <RisksView />}
            {view === "operate" && <OperateView />}
            {view === "questions" && <QuestionsView />}
          </div>
          <div className="absolute inset-x-0 bottom-xl flex justify-center">
            <Toolbar>
              {reportViews.map(({ id, label, icon: ViewIcon }) => (
                <Tooltip key={id} content={label} position="top">
                  <ToolbarItem
                    icon={<ViewIcon size={24} strokeWidth={1.5} />}
                    selected={view === id}
                    aria-label={`Show ${label}`}
                    aria-pressed={view === id}
                    onClick={() => setView(id)}
                  />
                </Tooltip>
              ))}
            </Toolbar>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page sections                                                       */
/* ------------------------------------------------------------------ */

const navItems = [
  { label: "Quickstart", id: "quickstart" },
  { label: "CLI", id: "cli" },
  { label: "Limits", id: "limits" },
  { label: "FAQ", id: "faq" },
];

function SiteHeader() {
  return (
    <header
      data-anim="header"
      className="mx-auto flex w-full max-w-page items-center justify-between gap-lg px-xl py-xl md:px-2xl"
    >
      <Logo />
      <div className="flex items-center gap-xs">
        <nav aria-label="Page sections" className="hidden items-center gap-xs sm:flex">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="subtle"
              size="small"
              className="text-text-primary hover:text-text-secondary"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto flex w-full max-w-page flex-col items-center px-xl pb-4xl pt-3xl text-center md:px-2xl md:pb-section md:pt-4xl"
    >
      <p
        data-anim="hero-eyebrow"
        className="flex flex-wrap items-center justify-center gap-xs text-label-sm text-text-secondary"
      >
        <span>CLI</span>
        <span aria-hidden="true">·</span>
        <span>MCP server</span>
        <span aria-hidden="true">·</span>
        <ClaudeLogo size={14} />
        <span>Claude Code skill</span>
      </p>
      <Heading level={1} id="hero-title" className="type-hero mt-lg max-w-article">
        <span data-anim="hero-title" className="block">
          Could someone who didn’t write this safely run it?
        </span>
      </Heading>
      <p data-anim="hero-body" className="mt-xl max-w-copy text-label text-text-secondary">
        BusFactor scans a repository and returns an operability verdict, a risk map, an OPERATE.md,
        and questions only the original author can answer. Every claim cites a file and line.
      </p>
      <div data-anim="hero-cta" className="mt-2xl flex flex-col items-center gap-md">
        <CopyButton text={LOCAL_COMMAND} variant="primary" size="medium">
          <span className="font-mono">{LOCAL_COMMAND}</span>
        </CopyButton>
        <p data-anim="hero-note" className="text-video-title text-text-secondary">
          Local paths or public GitHub URLs. No repository code is executed.
        </p>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section
      data-anim="showcase"
      aria-label="Example BusFactor report"
      className="relative isolate overflow-hidden px-md py-3xl md:px-2xl md:py-section"
    >
      <img
        src={duskRoad}
        alt=""
        data-anim="showcase-bg"
        className="absolute inset-0 -z-10 size-full object-cover will-change-transform"
        loading="eager"
      />
      <div data-anim="report">
        <ReportWindow />
      </div>
    </section>
  );
}

function FeatureCardBackdrop({ position }: { position: string }) {
  return (
    <>
      <img
        src={duskRoad}
        alt=""
        aria-hidden="true"
        data-anim="feature-card-bg"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover"
        style={{ objectPosition: position }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, rgba(82,80,243,0.42), rgba(11,11,20,0.72))",
        }}
      />
    </>
  );
}

function CitationVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const findings = [
    { title: "Deploy path", cite: "src/deploy.ts:42", status: "Cited", tone: "text-success" },
    { title: "Ownership map", cite: "OWNERS.md:7", status: "Cited", tone: "text-success" },
    { title: "Recovery steps", cite: "docs/runbook.md", status: "Gap", tone: "text-warning" },
  ];

  useMotionGsap(() => {
    const root = rootRef.current;
    if (!root) return;
    const rows = gsap.utils.toArray<HTMLElement>('[data-anim="cite-row"]', root);
    if (rows.length === 0) return;
    gsap.from(rows, {
      scrollTrigger: { trigger: root, start: "top 88%" },
      autoAlpha: 0,
      y: 14,
      duration: 0.55,
      stagger: 0.12,
      ease: "power2.out",
    });
    const bg = root.querySelector('[data-anim="feature-card-bg"]');
    if (bg) {
      gsap.set(bg, { scale: 1.15 });
      gsap.to(bg, {
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        yPercent: 6,
        ease: "none",
      });
    }
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className="relative isolate flex h-[380px] w-full items-center justify-center overflow-hidden rounded-corner-lg p-lg"
    >
      <FeatureCardBackdrop position="center 30%" />
      <div className="relative w-[90%] max-w-[640px] rounded-corner-md bg-surface-bg p-lg shadow-xl">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="size-2 rounded-corner-full bg-brand-primary" />
            <span className="text-label font-medium text-text-primary">Operability verdict</span>
          </div>
          <div className="flex items-baseline gap-xs">
            <span className="text-heading font-semibold text-text-primary">64</span>
            <span className="text-label-sm text-text-secondary">/ 100</span>
          </div>
        </div>
        <div className="mt-md flex flex-wrap gap-xs">
          {["setup", "deploys", "recovery", "ownership"].map((chip) => (
            <span
              key={chip}
              className="rounded-corner-sm bg-bg-faint px-sm py-xs text-label-sm text-text-secondary"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-md flex flex-col gap-sm">
          {findings.map((finding) => (
            <div
              key={finding.cite}
              data-anim="cite-row"
              className="flex items-center justify-between gap-md rounded-corner-sm border border-border-secondary bg-bg-faint px-md py-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-label-sm text-text-primary">{finding.title}</p>
                <p className="mt-xs truncate font-mono text-label-sm text-brand-primary">
                  {finding.cite}
                </p>
              </div>
              <span className={`shrink-0 text-label-sm font-medium ${finding.tone}`}>
                {finding.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OperateVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rows = [
    { label: "Runbook assembled", status: "Ready", tone: "text-success", progress: "w-full" },
    { label: "Escalation path", status: "Drafted", tone: "text-brand-primary", progress: "w-3/4" },
    { label: "Author questions", status: "3 open", tone: "text-warning", progress: "w-1/2" },
  ];

  useMotionGsap(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = gsap.utils.toArray<HTMLElement>('[data-anim="operate-row"]', root);
    if (items.length === 0) return;
    gsap.from(items, {
      scrollTrigger: { trigger: root, start: "top 88%" },
      autoAlpha: 0,
      y: 14,
      duration: 0.55,
      stagger: 0.12,
      ease: "power2.out",
    });
    const bg = root.querySelector('[data-anim="feature-card-bg"]');
    if (bg) {
      gsap.set(bg, { scale: 1.15 });
      gsap.to(bg, {
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        yPercent: -6,
        ease: "none",
      });
    }
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className="relative isolate flex h-[380px] w-full items-center justify-center overflow-hidden rounded-corner-lg p-lg"
    >
      <FeatureCardBackdrop position="center 70%" />
      <div className="relative w-[90%] max-w-[640px] rounded-corner-md bg-surface-bg p-lg shadow-xl">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="size-2 rounded-corner-full bg-brand-primary" />
            <span className="font-mono text-label-sm text-text-primary">OPERATE.md</span>
          </div>
          <span className="text-label-sm uppercase tracking-wide text-text-tertiary">
            Updated just now
          </span>
        </div>
        <div className="mt-md flex flex-col gap-sm">
          {rows.map((row) => (
            <div
              key={row.label}
              data-anim="operate-row"
              className="rounded-corner-sm border border-border-secondary bg-bg-faint px-md py-sm"
            >
              <div className="flex items-center justify-between gap-md">
                <span className="text-label-sm text-text-primary">{row.label}</span>
                <span className={`text-label-sm font-medium ${row.tone}`}>{row.status}</span>
              </div>
              <div className="mt-sm h-xs w-full rounded-corner-full bg-bg-subtle">
                <div className={`h-full rounded-corner-full bg-brand-primary ${row.progress}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  visual,
  icon: Icon,
  title,
  text,
}: {
  visual: ReactNode;
  icon: Icon;
  title: string;
  text: string;
}) {
  return (
    <article data-anim="feature-card" className="flex flex-col">
      <div data-anim="feature-visual">{visual}</div>
      <div className="mt-xl">
        <span className="flex size-9 items-center justify-center rounded-corner-md bg-surface-hover text-brand-primary">
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <Heading level={3} className="mt-md text-heading font-medium text-text-primary">
          {title}
        </Heading>
        <p className="mt-sm max-w-copy text-label-sm leading-relaxed text-text-secondary">{text}</p>
      </div>
    </article>
  );
}

function Features() {
  return (
    <Section labelledBy="features-title">
      <div data-anim="section-header" className="flex flex-col items-start gap-md">
        <p className="text-label-sm font-medium uppercase tracking-[0.18em] text-text-tertiary">
          What a scan returns
        </p>
        <Heading level={2} id="features-title" className="type-display">
          Evidence, not opinions.
        </Heading>
        <p className="max-w-copy text-label text-text-secondary">
          Most tools hand you a score and a shrug. BusFactor shows the file and line behind every
          claim, then drafts the handoff your team actually needs.
        </p>
      </div>
      <div data-anim="features-grid" className="mt-3xl grid gap-2xl md:grid-cols-2 md:gap-3xl">
        <FeatureCard
          visual={<CitationVisual />}
          icon={LinkIcon}
          title="Cited, not asserted."
          text="An operability verdict and a risk map where every finding points to a file and line. Check each claim in seconds instead of trusting a number."
        />
        <FeatureCard
          visual={<OperateVisual />}
          icon={FileText}
          title="A head start, not a blank page."
          text="A drafted OPERATE.md, the questions only the author can answer, and exports in Markdown or JSON for people and for pipelines."
        />
      </div>
    </Section>
  );
}

function HighlightCard({
  visual,
  title,
  text,
}: {
  visual: ReactNode;
  title: string;
  text: ReactNode;
}) {
  return (
    <div
      data-anim="highlight-card"
      className="flex flex-col items-center rounded-corner-lg border border-border-secondary bg-surface-secondary-bg px-xl pb-2xl pt-2xl text-center md:px-2xl"
    >
      <div className="flex h-visual w-full items-center justify-center" aria-hidden="true">
        {visual}
      </div>
      <Heading level={3} className="mt-xl text-label font-medium">
        {title}
      </Heading>
      <p className="mt-sm max-w-copy text-label-sm text-text-secondary">{text}</p>
    </div>
  );
}

function ScoreVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const widths = ["w-11/12", "w-3/4", "w-5/6", "w-1/2", "w-1/3", "w-1/4", "w-2/3"];

  useMotionGsap(() => {
    const fills = gsap.utils.toArray<HTMLElement>('[data-anim="score-fill"]', rootRef.current);
    if (fills.length === 0) return;
    // Grow each bar from its left edge with a transform, never animating width.
    gsap.from(fills, {
      scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.8,
      stagger: 0.07,
      ease: "power3.out",
    });
  }, rootRef);

  return (
    <div ref={rootRef} className="flex w-full max-w-copy items-end gap-xl">
      <div className="flex flex-1 flex-col gap-sm">
        {widths.map((width, index) => (
          <div key={index} className="h-xs w-full rounded-corner-full bg-bg-subtle">
            <div
              data-anim="score-fill"
              className={`h-full rounded-corner-full ${width} ${
                index === 4 || index === 5 ? "bg-warning" : "bg-brand-primary"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end">
        <span className="type-display text-text-primary">100</span>
        <span className="text-video-title text-text-secondary">points</span>
      </div>
    </div>
  );
}

function IntegrationVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiles: { icon: Icon; className: string }[] = [
    { icon: Terminal, className: "-rotate-6 translate-y-sm" },
    { icon: Plug, className: "z-10 -translate-y-sm" },
    { icon: ClaudeLogo, className: "rotate-6 translate-y-sm" },
  ];

  useMotionGsap(() => {
    const items = gsap.utils.toArray<HTMLElement>('[data-anim="tile"]', rootRef.current);
    if (items.length === 0) return;
    // GSAP reads the tiles' existing CSS rotation from the transform matrix and
    // keeps it, so only opacity, lift and scale change here.
    gsap.from(items, {
      scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
      autoAlpha: 0,
      y: 24,
      scale: 0.7,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });
  }, rootRef);

  return (
    <div ref={rootRef} className="flex items-center -space-x-md">
      {tiles.map(({ icon: TileIcon, className }, index) => (
        <div
          key={index}
          data-anim="tile"
          className={`flex size-4xl items-center justify-center rounded-corner-lg border border-border-primary bg-surface-bg text-text-primary ${className}`}
        >
          <TileIcon size={32} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

function Highlights() {
  return (
    <Section labelledBy="highlights-title" className="pt-0 md:pt-0">
      <Heading level={2} id="highlights-title" className="sr-only">
        How BusFactor works
      </Heading>
      <div data-anim="highlights-grid" className="grid gap-xl lg:grid-cols-2">
        <HighlightCard
          visual={<ScoreVisual />}
          title="Code scores. The model explains."
          text="Seven dimensions, 100 points. Code computes the score; the LLM explains and drafts. The rubric is public and versioned."
        />
        <HighlightCard
          visual={<IntegrationVisual />}
          title="Works where your agents work"
          text={
            <>
              Run it from the terminal, expose it through the MCP server, or hand it to{" "}
              <ClaudeLogo size={14} className="inline-block align-[-2px]" /> Claude Code as a skill.
            </>
          }
        />
      </div>
    </Section>
  );
}

function QuickCommand({ command }: { command: string }) {
  return (
    <div className="flex flex-col items-center gap-xl pt-2xl text-center">
      <code className="max-w-full break-words font-mono text-heading text-text-primary">
        {command}
      </code>
      <p className="text-label-sm text-text-secondary">
        Up to 5,000 files or 25 MB per scan. No repository code is executed.
      </p>
      <CopyButton text={command} variant="primary" size="medium">
        Copy command
      </CopyButton>
    </div>
  );
}

function Quickstart() {
  return (
    <Section id="quickstart" labelledBy="quickstart-title">
      <SectionHeader
        id="quickstart-title"
        title="Start with one command"
        text="Point it at a folder on your machine, or at any public GitHub repository."
      />
      <div
        data-anim="quickstart-panel"
        className="mx-auto mt-2xl w-full max-w-article [&_[role=tablist]]:justify-center"
      >
        <Tabs
          tabs={[
            {
              id: "local",
              label: "Local path",
              content: <QuickCommand command={LOCAL_COMMAND} />,
            },
            {
              id: "github",
              label: "GitHub URL",
              content: <QuickCommand command={GITHUB_COMMAND} />,
            },
          ]}
          defaultTab="local"
        />
      </div>
    </Section>
  );
}

const integrations: {
  badge: string;
  title: string;
  text: string;
  snippet: string;
  copyLabel: string;
  logo?: boolean;
}[] = [
  {
    badge: "npx",
    title: "Command line",
    text: "Scan, export Markdown or JSON, and gate CI with a minimum score.",
    snippet: LOCAL_COMMAND,
    copyLabel: "Copy command",
  },
  {
    badge: "3 tools",
    title: "MCP server",
    text: "Exposes scan_repo, get_report, and generate_operate_md to any MCP client.",
    snippet: MCP_COMMAND,
    copyLabel: "Copy command",
  },
  {
    badge: "Skill",
    title: "Claude Code skill",
    logo: true,
    text: "A ready-made handoff skill for Claude Code, checked into the repository.",
    snippet: SKILL_PATH,
    copyLabel: "Copy path",
  },
];

function IntegrationDestinationsVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const destinations = [
    { icon: Terminal, label: "CLI" },
    { icon: Plug, label: "MCP" },
    { icon: ClaudeLogo, label: "Skill" },
  ];

  useMotionGsap(() => {
    const root = rootRef.current;
    if (!root) return;
    const tiles = gsap.utils.toArray<HTMLElement>('[data-anim="dest-tile"]', root);
    if (tiles.length === 0) return;
    gsap.from(tiles, {
      scrollTrigger: { trigger: root, start: "top 85%" },
      autoAlpha: 0,
      y: 24,
      scale: 0.8,
      duration: 0.6,
      stagger: 0.12,
      ease: "back.out(1.6)",
    });
    const bg = root.querySelector('[data-anim="feature-card-bg"]');
    if (bg) {
      gsap.set(bg, { scale: 1.15 });
      gsap.to(bg, {
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        yPercent: 6,
        ease: "none",
      });
    }
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className="relative isolate h-full min-h-[380px] overflow-hidden rounded-corner-lg md:min-h-[460px]"
    >
      <FeatureCardBackdrop position="center 45%" />
      <div className="absolute left-1/2 top-[30%] z-10 flex -translate-x-1/2 flex-col items-center gap-sm rounded-corner-md bg-surface-bg px-xl py-lg shadow-xl">
        <span className="flex size-9 items-center justify-center rounded-corner-sm bg-brand-primary text-on-brand">
          <FileCode2 size={18} strokeWidth={1.5} />
        </span>
        <span className="font-mono text-label-sm text-text-primary">report.md</span>
      </div>
      <div className="absolute inset-x-0 top-[64%] z-20 flex items-center justify-center gap-lg">
        {destinations.map(({ icon: DestIcon, label }) => (
          <div key={label} data-anim="dest-tile" className="flex flex-col items-center gap-sm">
            <div className="flex size-4xl items-center justify-center rounded-corner-md bg-surface-bg text-brand-primary shadow-lg">
              <DestIcon size={26} strokeWidth={1.5} />
            </div>
            <span className="text-label-sm text-text-primary">{label}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-xl left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-corner-full bg-surface-bg px-md py-xs text-label-sm text-text-primary">
        Report delivered
      </div>
    </div>
  );
}

function Integrations() {
  return (
    <Section id="integrations" labelledBy="integrations-title">
      <div data-anim="section-header" className="mb-3xl">
        <Heading level={2} id="integrations-title" className="type-display">
          Use it where you work.
        </Heading>
      </div>
      <div className="grid items-start gap-3xl md:grid-cols-[1.1fr_0.9fr] md:gap-4xl">
        <div data-anim="integration-visual">
          <IntegrationDestinationsVisual />
        </div>
        <div className="flex flex-col">
          <p data-anim="integration-intro" className="text-label leading-relaxed text-text-secondary">
            BusFactor delivers a finished report into the tools your team already lives in and the
            formats your stakeholders expect. No new surface to learn, no exports to chase.
          </p>
          <ul data-anim="integrations-list" className="mt-xl flex flex-col">
            {integrations.map((item) => (
              <li
                key={item.title}
                data-anim="integration-card"
                className="border-t border-border-secondary py-lg first:border-t-0 first:pt-0"
              >
                <div className="flex items-center gap-md">
                  {item.logo && <ClaudeLogo size={18} className="shrink-0" />}
                  <Badge label={item.badge} variant="secondary" />
                  <Heading level={3} className="text-label font-semibold text-text-primary">
                    {item.title}
                  </Heading>
                </div>
                <p className="mt-sm text-label-sm text-text-secondary">{item.text}</p>
                <div className="mt-md flex flex-wrap items-center gap-sm">
                  <code className="min-w-0 truncate rounded-corner-md bg-bg-faint px-md py-sm font-mono text-label-sm text-text-primary">
                    {item.snippet}
                  </code>
                  <CopyButton
                    text={item.snippet}
                    variant="subtle"
                    className="text-text-primary hover:text-text-secondary"
                  >
                    {item.copyLabel}
                  </CopyButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

const flags = [
  { flag: "--out <dir>", text: "Directory the report is written to." },
  { flag: "--format md,json", text: "Markdown, JSON, or both." },
  { flag: "--fail-under <score>", text: "Exit with code 2 when the score falls below this bar." },
];

const exitCodes: { code: string; text: string; variant: "success" | "warning" | "danger" }[] = [
  { code: "0", text: "Success", variant: "success" },
  { code: "2", text: "--fail-under missed", variant: "warning" },
  { code: "1", text: "Error", variant: "danger" },
];

function CliReference() {
  return (
    <Section id="cli" labelledBy="cli-title">
      <SectionHeader
        id="cli-title"
        title="Built for CI"
        text="Fail the build when operability drops below your bar. The full CLI fits on one screen."
      />
      <div
        data-anim="cli-panel"
        className="mx-auto mt-3xl w-full max-w-article overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-secondary-bg"
      >
        <div className="flex items-center justify-between gap-lg border-b border-border-secondary px-xl py-lg">
          <div className="flex items-center gap-sm text-text-primary">
            <Terminal size={16} />
            <span className="font-mono text-label-sm">busfactor scan</span>
          </div>
          <CopyButton
            text={CLI_COMMAND}
            variant="subtle"
            className="text-text-primary hover:text-text-secondary"
          >
            Copy usage
          </CopyButton>
        </div>
        <div className="flex flex-col gap-md p-lg">
          <div className="flex flex-col gap-sm rounded-corner-md bg-bg-faint p-lg">
            <span className="text-video-title text-text-secondary">Usage</span>
            <code className="break-words font-mono text-label-sm text-text-primary">
              {CLI_COMMAND}
            </code>
          </div>
          {flags.map((item) => (
            <div
              key={item.flag}
              className="flex flex-col gap-xs rounded-corner-md bg-bg-faint p-lg sm:flex-row sm:items-center sm:justify-between sm:gap-xl"
            >
              <code className="shrink-0 font-mono text-label-sm text-text-primary">
                {item.flag}
              </code>
              <span className="text-label-sm text-text-secondary sm:text-right">{item.text}</span>
            </div>
          ))}
          <div className="flex flex-col gap-md rounded-corner-md bg-bg-faint p-lg">
            <span className="text-video-title text-text-secondary">Exit codes</span>
            <ul className="flex flex-wrap gap-x-xl gap-y-md">
              {exitCodes.map((item) => (
                <li key={item.code} className="flex items-center gap-sm">
                  <Badge label={item.code} variant={item.variant} />
                  <span className="text-label-sm text-text-primary">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

const limits: { icon: Icon; title: string; text: string }[] = [
  { icon: Archive, title: "5,000 files or 25 MB", text: "per scan" },
  { icon: Globe, title: "Public GitHub or local", text: "the two supported sources" },
  { icon: Lock, title: "Nothing is executed", text: "repository code never runs" },
  { icon: Trash2, title: "Deleted after 7 days", text: "source snapshots are removed" },
];

function Limits() {
  return (
    <Section id="limits" labelledBy="limits-title">
      <SectionHeader
        id="limits-title"
        title="Limits, stated plainly"
        text="What the free plan can read, and what happens to your code afterwards."
      />
      <ul
        data-anim="limits-list"
        className="mt-3xl grid gap-x-2xl gap-y-3xl sm:grid-cols-2 lg:grid-cols-4"
      >
        {limits.map(({ icon: LimitIcon, title, text }) => (
          <li key={title} data-anim="limit" className="flex flex-col items-center text-center">
            <LimitIcon size={24} strokeWidth={1.5} className="text-text-primary" />
            <p className="mt-lg text-label font-medium text-text-primary">{title}</p>
            <p className="mt-xs text-label-sm text-text-secondary">{text}</p>
          </li>
        ))}
      </ul>
      <div
        data-anim="limits-note"
        className="mx-auto mt-3xl flex max-w-copy flex-col items-center gap-sm text-center"
      >
        <Badge label="Free plan" variant="secondary" />
        <p className="text-label-sm text-text-secondary">
          These limits apply to the free plan. Paid plans with higher limits, private repositories,
          and longer retention are coming soon.
        </p>
      </div>
    </Section>
  );
}

const faqs: { icon: Icon; question: string; answer: string }[] = [
  {
    icon: FileText,
    question: "What does a scan actually produce?",
    answer:
      "An operability verdict, a risk map, an OPERATE.md handoff guide, and a list of questions only the original author can answer. Every claim cites the file and line it came from, so you can verify it instead of trusting it.",
  },
  {
    icon: Lock,
    question: "Does BusFactor run any repository code?",
    answer:
      "No. A scan reads source files statically — nothing is executed, installed, or connected to the network. Source snapshots are deleted after 7 days, and they are never pooled into a shared training set.",
  },
  {
    icon: CircleHelp,
    question: "What are “author questions”?",
    answer:
      "They are the things the code cannot tell you: why a workaround exists, which external dependency is fragile, or what a teammate needs to know before changing a critical path. BusFactor surfaces them so the knowledge leaves with more than one person.",
  },
  {
    icon: Gauge,
    question: "What does the operability score measure?",
    answer:
      "It scores how safely someone who didn’t write the code could run and change it — documentation, risk concentration, and handoff readiness. It is not a code-quality or style score.",
  },
  {
    icon: Sparkles,
    question: "How does the model learn without training on our data?",
    answer:
      "Your data stays in your environment. Nothing you scan is used to train a shared model. What the system learns from your team’s decisions is scoped to your team alone and is yours to keep.",
  },
  {
    icon: KeyRound,
    question: "Can I scan private repositories?",
    answer:
      "The free plan supports public GitHub repositories and local paths. Private repositories, higher limits, and longer retention are part of the paid plans, which are coming soon.",
  },
  {
    icon: Terminal,
    question: "Can I run BusFactor in CI?",
    answer:
      "Yes. The CLI prints Markdown or JSON and exits with code 2 when the score falls below your --fail-under threshold, so you can gate a build on operability the same way you gate on tests.",
  },
  {
    icon: Workflow,
    question: "How is this different from a code scanner?",
    answer:
      "Linters and scanners find defects in code. BusFactor answers a handoff question: could someone who didn’t write this safely run it? It focuses on ownership, risk, and the knowledge that walks out the door when an author leaves.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeader
        id="faq-title"
        badge="FAQ"
        title="Frequently asked questions"
        text="Quick answers on ownership, deployment, and how the system learns."
      />
      <ul data-anim="faq-list" className="mx-auto mt-3xl flex max-w-article flex-col gap-md">
        {faqs.map(({ icon: FaqIcon, question, answer }, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <li
              key={question}
              data-anim="faq-item"
              className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-secondary-bg"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center gap-lg px-xl py-lg text-left"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-corner-md bg-surface-hover text-brand-primary">
                    <FaqIcon size={18} strokeWidth={1.5} />
                  </span>
                  <span className="flex-1 text-label font-medium text-text-primary">{question}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={`shrink-0 text-text-secondary transition-transform duration-200 motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-xl pb-xl pl-[calc(var(--space-xl)+2rem+var(--space-lg))] text-label-sm leading-relaxed text-text-secondary">
                    {answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function SiteFooter() {
  return (
    <footer data-anim="footer" className="relative isolate mt-4xl overflow-hidden md:mt-section">
      <img
        src={duskRoad}
        alt=""
        data-anim="footer-bg"
        className="absolute inset-0 -z-10 size-full object-cover object-bottom will-change-transform"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-modal-scrim to-transparent" />
      <div
        data-anim="footer-inner"
        className="mx-auto flex min-h-footer w-full max-w-page flex-col justify-end px-xl pb-2xl md:px-2xl"
      >
        <div className="flex flex-col gap-lg sm:flex-row sm:items-center sm:justify-between">
          <Logo className="text-on-brand" />
          <div className="flex flex-wrap items-center gap-xs">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="subtle"
                size="small"
                className="text-on-brand"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            ))}
            <span className="px-md text-label-sm text-on-brand">License TBD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageAnimations(rootRef);

  return (
    <ClipboardProvider>
      <div ref={rootRef} className="min-h-screen bg-brand-tertiary font-sans text-text-primary">
        <SiteHeader />
        <main>
          <Hero />
          <Showcase />
          <Features />
          <Highlights />
          <Quickstart />
          <Integrations />
          <CliReference />
          <Limits />
          <Faq />
        </main>
        <SiteFooter />
      </div>
    </ClipboardProvider>
  );
}
