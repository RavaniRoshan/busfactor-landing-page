export type DocBlock =
  | { type: "p"; text: string }
  | { type: "code"; code: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "list"; items: string[] }
  | { type: "note"; tone: "info" | "warn"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type DocSection = {
  id: string;
  title: string;
  lead?: string;
  blocks: DocBlock[];
};

export type DocGroup = {
  id: string;
  label: string;
  description: string;
  sections: DocSection[];
};

export const docGroups: DocGroup[] = [
  {
    id: "tutorials",
    label: "Tutorials",
    description: "Learn by doing — get to a working scan in a few minutes.",
    sections: [
      {
        id: "first-scan",
        title: "Scan your first repository",
        lead: "A short lesson: take a codebase you know nothing about and find out whether you could safely operate it.",
        blocks: [
          { type: "p", text: "You need Node.js installed. No account, signup, or API key is required for a local folder or a public GitHub repository." },
          {
            type: "steps",
            items: [
              { title: "Run a scan", text: "Point BusFactor at a folder on your machine. The command prints a verdict when it finishes." },
              { title: "Read the verdict", text: "The score answers one question: could someone who didn't write this code run and change it safely?" },
              { title: "Open the risk map", text: "Find the area most likely to break during a handoff — setup, deploys, recovery, or ownership." },
              { title: "Draft the handoff", text: "Generate OPERATE.md, then answer the questions only the original author can answer." },
            ],
          },
          { type: "code", code: "npx busfactor scan ./my-repo" },
          { type: "p", text: "To try it on a public repository instead, replace the path with its GitHub URL." },
          { type: "code", code: "npx busfactor scan https://github.com/owner/repo" },
          { type: "note", tone: "info", text: "Nothing is executed. BusFactor reads source files statically; repository code never runs." },
        ],
      },
    ],
  },
  {
    id: "how-to",
    label: "How-to guides",
    description: "Recipes for specific jobs once you already know the basics.",
    sections: [
      {
        id: "gate-ci",
        title: "Gate a build on operability",
        lead: "Fail CI when a repository scores below the bar your team agrees on.",
        blocks: [
          { type: "p", text: "Use --fail-under with a minimum score. The command exits with code 2 when the score is below that threshold, so a build can treat it like a failing test." },
          { type: "code", code: "busfactor scan . --format json --fail-under 70" },
          { type: "p", text: "Write Markdown for people and JSON for pipelines when you want both a readable report and a machine-readable result." },
          { type: "code", code: "busfactor scan . --out ./reports --format md,json" },
          { type: "note", tone: "warn", text: "Exit code 2 means the score was missed, not that the scan failed. Reserve exit code 1 for real errors." },
        ],
      },
      {
        id: "read-report",
        title: "Read a report",
        lead: "A report has four views. Each answers a different question.",
        blocks: [
          {
            type: "list",
            items: [
              "Verdict — the score and the findings behind it.",
              "Risk map — where a handoff breaks first.",
              "OPERATE.md — a drafted runbook for someone new.",
              "Author questions — what the code cannot tell you.",
            ],
          },
          { type: "p", text: "Every finding cites a file and line. Open the citation to verify the claim yourself instead of taking the tool's word for it." },
        ],
      },
      {
        id: "mcp-server",
        title: "Use the MCP server",
        lead: "Expose scans to any MCP client so an assistant can fetch evidence on demand.",
        blocks: [
          { type: "code", code: "node packages/mcp/dist/index.js" },
          { type: "p", text: "The server exposes three tools: scan_repo, get_report, and generate_operate_md." },
          { type: "list", items: ["scan_repo — run a scan against a path or URL.", "get_report — retrieve an existing report.", "generate_operate_md — draft the handoff document."] },
        ],
      },
      {
        id: "claude-skill",
        title: "Use the Claude Code skill",
        lead: "Give Claude Code a ready-made handoff workflow checked into the repository.",
        blocks: [
          { type: "code", code: "skills/handoff/SKILL.md" },
          { type: "p", text: "The skill tells Claude Code how to run a scan, read the evidence, and turn the result into an OPERATE.md that a teammate can actually follow." },
        ],
      },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    description: "Exact details: flags, codes, dimensions, limits, and privacy behaviour.",
    sections: [
      {
        id: "cli-reference",
        title: "CLI reference",
        lead: "The full scan command and its options.",
        blocks: [
          { type: "code", code: "busfactor scan <path|url> --out <dir> --format md,json --fail-under <score>" },
          {
            type: "table",
            head: ["Flag", "Meaning"],
            rows: [
              ["--out <dir>", "Directory the report is written to."],
              ["--format md,json", "Markdown, JSON, or both."],
              ["--fail-under <score>", "Exit with code 2 when the score falls below this bar."],
            ],
          },
          { type: "p", text: "Exit codes: 0 success, 2 when --fail-under is missed, 1 on error." },
        ],
      },
      {
        id: "scoring",
        title: "Scoring rubric",
        lead: "Seven dimensions, 100 points. The rubric is public and versioned.",
        blocks: [
          {
            type: "list",
            items: [
              "Runnability",
              "Secrets and configuration",
              "Failure handling and observability",
              "Tests and CI",
              "Critical paths",
              "Dependencies",
              "Knowledge capture",
            ],
          },
          { type: "p", text: "Code computes the score from repository evidence. The model explains the findings and drafts the handoff — it does not invent the number." },
        ],
      },
      {
        id: "limits",
        title: "Limits and privacy",
        lead: "What the free plan can read, and what happens to your code.",
        blocks: [
          {
            type: "list",
            items: [
              "5,000 files or 25 MB per scan.",
              "Public GitHub URLs and local paths.",
              "Repository code is never executed.",
              "Source snapshots are deleted after 7 days.",
            ],
          },
          { type: "p", text: "Private repositories, higher limits, and longer retention are part of paid plans, which are coming soon." },
        ],
      },
    ],
  },
  {
    id: "explanation",
    label: "Explanation",
    description: "Understand the ideas behind the tool and why it works this way.",
    sections: [
      {
        id: "operability",
        title: "What operability means",
        lead: "Operability is not code quality. It is whether a newcomer can safely run and change the system.",
        blocks: [
          { type: "p", text: "A clean, well-tested codebase can still be impossible to hand over if nobody wrote down how to deploy it, who owns it, or what to do when it breaks. BusFactor measures that handoff readiness, not style or syntax." },
          { type: "p", text: "The score concentrates on documentation, risk concentration, and the knowledge that leaves with an author." },
        ],
      },
      {
        id: "citations",
        title: "Why every claim is cited",
        lead: "A verdict you cannot check is just an opinion with a number attached.",
        blocks: [
          { type: "p", text: "Each finding points to a file and line. That makes the report auditable: you can open the source, confirm the claim, and decide whether to act on it. It also keeps the model honest — it explains evidence that is already in the repository." },
        ],
      },
      {
        id: "author-questions",
        title: "Why author questions matter",
        lead: "Some knowledge never existed in the code in the first place.",
        blocks: [
          { type: "p", text: "Why a workaround exists, which dependency is fragile, who rotates a secret — the code cannot answer these. BusFactor writes them down before the author moves on, so the answer is not lost with them." },
        ],
      },
    ],
  },
];
