#!/usr/bin/env node
// Design-system audit for changed code.
//
// Reads the diff between a base branch and the working tree (committed,
// staged, unstaged and new files) and flags added lines that break a
// rule in CLAUDE.md or design-system/02-components.md. It only looks at
// what changed, so older code does not drown the signal.
//
//   pnpm audit:design                 base = origin/dev, else origin/main
//   pnpm audit:design --base main     pick the base
//   pnpm audit:design --strict        exit 1 when an error is found
//   pnpm audit:design --json          machine-readable findings
//
// This covers the rules a pattern can catch. The judgment rules (one
// primary per fold, fold jobs, mobile hierarchy, component states) are
// the design-auditor agent's job: .claude/agents/design-auditor.md.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const git = (...a) =>
  execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const tryGit = (...a) => {
  try {
    return git(...a).trim();
  } catch {
    return "";
  }
};

function pickBase() {
  const asked = option("--base");
  const candidates = asked
    ? [asked, `origin/${asked}`]
    : ["origin/dev", "dev", "origin/main", "main"];
  for (const ref of candidates) {
    if (tryGit("rev-parse", "--verify", "--quiet", ref)) return ref;
  }
  return null;
}

const base = pickBase();
if (!base) {
  console.error("design-audit: no base branch found. Pass --base <ref>.");
  process.exit(2);
}
const mergeBase = tryGit("merge-base", base, "HEAD") || base;

// ---------- collect added lines ----------

const SCOPE = ["app", "components", "lib", "package.json"];
/** @type {{file: string, line: number, text: string}[]} */
const added = [];
const changedFiles = new Set();
const newFiles = new Set();

const diff = tryGit(
  "diff",
  "--unified=0",
  "--no-color",
  mergeBase,
  "--",
  ...SCOPE,
);
let file = null;
let lineNo = 0;
for (const raw of diff.split("\n")) {
  if (raw.startsWith("+++ ")) {
    file = raw.slice(4) === "/dev/null" ? null : raw.slice(6);
    if (file) changedFiles.add(file);
  } else if (raw.startsWith("new file mode")) {
    // the +++ line that follows names it; mark on the next header
    newFiles.add("__next__");
  } else if (raw.startsWith("@@")) {
    const m = /\+(\d+)/.exec(raw);
    lineNo = m ? Number(m[1]) : 0;
    if (newFiles.delete("__next__") && file) newFiles.add(file);
  } else if (raw.startsWith("+") && !raw.startsWith("+++") && file) {
    added.push({ file, line: lineNo, text: raw.slice(1) });
    lineNo += 1;
  }
}
newFiles.delete("__next__");

const untracked = tryGit(
  "ls-files",
  "--others",
  "--exclude-standard",
  "--",
  ...SCOPE,
);
for (const f of untracked.split("\n").filter(Boolean)) {
  changedFiles.add(f);
  newFiles.add(f);
  if (!/\.(tsx?|css|mdx|json)$/.test(f)) continue;
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((text, i) => {
      added.push({ file: f, line: i + 1, text });
    });
}

// Docs are outside SCOPE; ask git which of them changed.
const docsChanged = new Set(
  [
    tryGit(
      "diff",
      "--name-only",
      mergeBase,
      "--",
      "CLAUDE.md",
      "design-system",
      "app/sitemap.ts",
    ),
    tryGit("ls-files", "--others", "--exclude-standard", "--", "design-system"),
  ]
    .join("\n")
    .split("\n")
    .filter(Boolean),
);

// ---------- rules ----------

/** @type {{level: "error"|"warn"|"note", rule: string, file: string, line: number, message: string, fix: string, source: string}[]} */
const findings = [];
const report = (level, rule, at, message, fix, source) =>
  findings.push({
    level,
    rule,
    file: at.file,
    line: at.line,
    message,
    fix,
    source,
  });

// Files that hold an approved colour exception (CLAUDE.md §3 table) or
// are retired / sandbox surfaces the palette rule does not police.
const COLOR_ALLOWED = [
  /^app\/globals\.css$/,
  /^app\/unlock\//,
  /^app\/preview\/(a|b|c|v1|v2|v2\.1|ods|skeleton|sky|v44)\//,
  /^app\/(opengraph-image|icon|apple-icon)/,
  /^components\/product-venn/,
  /^components\/backstage-pass\.tsx$/,
  /^components\/cloud-background\.tsx$/,
  /^components\/github-graph\//,
  /^components\/coming-soon/,
  /^components\/lab-/,
  /^components\/resume-agents\/agents\.css$/,
  /^components\/about-collage\.css$/,
];
const CSS_ALLOWED = new Set([
  "app/globals.css",
  "components/about-collage.css",
  "app/unlock/backstage.css",
  "components/resume-agents/agents.css",
]);
// Pine shadow and lilac glow are the approved rgba families.
const APPROVED_RGBA =
  /rgba?\(\s*(31,\s*59,\s*46|203,\s*179,\s*232|184,\s*156,\s*220)/;

const isComment = (t) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(t);
const inUi = (f) => f.startsWith("components/ui/");
const isTsx = (f) => /\.tsx$/.test(f);
const isCode = (f) => /\.(tsx?|css)$/.test(f);

for (const at of added) {
  const { file: f, text: t } = at;
  if (!isCode(f) && f !== "package.json") continue;

  if (f === "package.json") {
    // Only flag lines that look like a dependency entry with a version.
    if (/^\s*"[^"]+":\s*"[\^~]?\d/.test(t) && !/"version"/.test(t)) {
      report(
        "warn",
        "new-dependency",
        at,
        `Dependency line changed: ${t.trim()}`,
        "Confirm with Megh that the package earns its place, or write the 30 lines yourself.",
        "CLAUDE.md §9",
      );
    }
    continue;
  }
  if (isComment(t)) continue;

  // Colour outside the tokens.
  if (!COLOR_ALLOWED.some((re) => re.test(f))) {
    // In-page anchors (href="#work") are not colours.
    const bare = t.replace(/href=\{?["'`]#[\w-]*["'`]\}?/g, "");
    const hex =
      /(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/.exec(
        bare,
      );
    const fn =
      /\b(?:rgba?|hsla?|oklch|oklab)\(/.test(t) && !APPROVED_RGBA.test(t);
    const tw =
      /\b(?:bg|text|border|ring|fill|stroke|from|to|via|decoration|shadow)-\[#/.test(
        t,
      );
    if (hex || fn || tw) {
      report(
        "error",
        "raw-colour",
        at,
        `Hard-coded colour: ${t.trim().slice(0, 110)}`,
        "Use a token (bg-bg, text-fg, border-border, text-accent-fg...). A colour outside Oatmeal / Pine / Lilac needs a row in the approved-exceptions table first.",
        "CLAUDE.md §3 Color tokens",
      );
    }
  } else if (
    f === "app/globals.css" &&
    /^\s*--[\w-]+:\s*(#|rgb|hsl|okl)/.test(t)
  ) {
    report(
      "warn",
      "new-token",
      at,
      `New colour token: ${t.trim()}`,
      "Add it to the approved-exceptions table in CLAUDE.md and to design-system/02-tokens.md in the same PR.",
      "CLAUDE.md §3, §9",
    );
  }

  if (isTsx(f) && !inUi(f)) {
    if (
      /rounded-full/.test(t) &&
      /\b(bg-accent|border-fg)\b/.test(t) &&
      /\bp[xy]?-\d/.test(t)
    ) {
      report(
        "error",
        "hand-rolled-pill",
        at,
        "A pill CTA built from a class string.",
        "Use <Button> / <ButtonLink>, or buttonStyles() for elements that cannot be either.",
        "design-system/02-components.md §1",
      );
    }
    if (
      /\bunderline\b/.test(t) &&
      /underline-offset-/.test(t) &&
      !/\[&_a\]/.test(t)
    ) {
      report(
        "warn",
        "hand-rolled-link",
        at,
        "A text link styled by hand.",
        "If this is a call to action, use <TextLink> (direction onward / external / back). Links inside running prose are exempt.",
        "design-system/02-components.md §2a",
      );
    }
    if (/[→↗←]/.test(t) && !/0→1/.test(t)) {
      report(
        "warn",
        "typed-arrow",
        at,
        `Typed arrow character: ${t.trim().slice(0, 80)}`,
        "Use <CtaArrow /> or a TextLink direction. Arrows on CTAs are inline SVG icons.",
        "CLAUDE.md §3 Iconography",
      );
    }
    if (
      /\bfont-mono\b/.test(t) &&
      /\buppercase\b/.test(t) &&
      /rounded-full/.test(t) &&
      /\bp[xy]?-\d/.test(t)
    ) {
      report(
        "warn",
        "mono-cta-label",
        at,
        "A pill with a mono, uppercase label.",
        "CTA labels are sentence case in Geist Sans. Mono capitals are for tags and eyebrows.",
        "design-system/02-components.md §1",
      );
    }
  }

  if (isTsx(f)) {
    if (/<img\b/.test(t)) {
      report(
        "error",
        "img-tag",
        at,
        "<img> tag.",
        "Use next/image with alt text.",
        "CLAUDE.md §7",
      );
    }
    if (
      /style=\{\{[^}]*\b(color|background|backgroundColor|boxShadow|fontFamily|border)\s*:\s*["'`]/.test(
        t,
      )
    ) {
      report(
        "error",
        "inline-style",
        at,
        "Static styling in an inline style.",
        "Move colours, fonts, shadows and gradients into a Tailwind class or a token. Inline style is only for runtime-computed values.",
        "CLAUDE.md §9",
      );
    }
    if (/\brounded-\[/.test(t)) {
      report(
        "warn",
        "arbitrary-radius",
        at,
        "Arbitrary border radius.",
        "Pick the nearest step: 4, 8, 12, 18px or full.",
        "CLAUDE.md §3 Radius",
      );
    }
    if (/\bz-\[\d/.test(t)) {
      report(
        "warn",
        "raw-z-index",
        at,
        "Raw z-index.",
        "Use the scale: drawer 40, nav 50, tooltip 70, toast 80.",
        "CLAUDE.md §3 Z-index",
      );
    }
    if (/(:\s*any\b|\bas any\b|<any>)/.test(t)) {
      report(
        "error",
        "ts-any",
        at,
        "`any` in TypeScript.",
        "Use unknown plus narrowing, or define the type.",
        "CLAUDE.md §9",
      );
    }
    if (/^\s*["']use client["']/.test(t)) {
      report(
        "note",
        "use-client",
        at,
        "New client component.",
        "Confirm it needs state, effects or browser APIs. Default is a server component.",
        "CLAUDE.md §9",
      );
    }
    if (
      /from\s+["'](framer-motion|motion\/react)["']/.test(t) ||
      /\banimate-(?!none)[\w[]/.test(t)
    ) {
      report(
        "warn",
        "new-motion",
        at,
        `Motion added: ${t.trim().slice(0, 80)}`,
        "Motion is sparing. Beyond a 150ms hover or a fade-up, it needs a row in the approved motion exceptions and a reduced-motion fallback.",
        "CLAUDE.md §3 Motion",
      );
    }
    if (/from\s+["']next\/font/.test(t)) {
      report(
        "error",
        "new-font",
        at,
        "Font import.",
        "Fonts are locked to Geist Sans, Geist Mono and Kalam, loaded in app/layout.tsx.",
        "CLAUDE.md §2",
      );
    }
  }

  if (/\.css$/.test(f) && /@keyframes\b/.test(t)) {
    report(
      "warn",
      "new-motion",
      at,
      `New keyframes: ${t.trim()}`,
      "Add a reduced-motion rule beside it, and a row in the approved motion exceptions if it is more than a hover or fade.",
      "CLAUDE.md §3 Motion",
    );
  }
}

// target="_blank" needs rel within a few lines.
for (const at of added) {
  if (
    !isTsx(at.file) ||
    !/target="_blank"/.test(at.text) ||
    !existsSync(at.file)
  )
    continue;
  const lines = readFileSync(at.file, "utf8").split("\n");
  const near = lines.slice(Math.max(0, at.line - 5), at.line + 4).join("\n");
  if (!/rel=/.test(near)) {
    report(
      "error",
      "blank-without-rel",
      at,
      'target="_blank" without rel.',
      'Add rel="noopener noreferrer", or use <TextLink direction="external">.',
      "CLAUDE.md §7",
    );
  }
}

// New CSS files.
for (const f of newFiles) {
  if (f.endsWith(".css") && !CSS_ALLOWED.has(f)) {
    report(
      "error",
      "new-css-file",
      { file: f, line: 1 },
      "New CSS file.",
      "Style in Tailwind or app/globals.css. A new CSS file needs a row in CLAUDE.md §9 before it ships.",
      "CLAUDE.md §9",
    );
  }
  if (
    /^app\/(?!preview\/).*\/page\.tsx$/.test(f) &&
    !docsChanged.has("app/sitemap.ts")
  ) {
    report(
      "warn",
      "page-without-sitemap",
      { file: f, line: 1 },
      "New page, sitemap unchanged.",
      "Add the route to app/sitemap.ts in the same PR, or say in the PR body why it is not indexed.",
      "CLAUDE.md §15",
    );
  }
}

// Spec drift: a shared primitive or token changed, the docs did not.
const uiChanged = [...changedFiles].filter((f) => inUi(f));
if (uiChanged.length && !docsChanged.has("design-system/02-components.md")) {
  report(
    "warn",
    "spec-not-updated",
    { file: uiChanged[0], line: 1 },
    `Shared primitive changed (${uiChanged.join(", ")}), design-system/02-components.md did not.`,
    "Update the component spec in the same PR.",
    "CLAUDE.md §3 Component states, §12",
  );
}
const tokenTouched = added.some(
  (a) => a.file === "app/globals.css" && /^\s*--[\w-]+:/.test(a.text),
);
if (tokenTouched && !docsChanged.has("design-system/02-tokens.md")) {
  report(
    "warn",
    "tokens-not-documented",
    { file: "app/globals.css", line: 1 },
    "A token changed in app/globals.css, design-system/02-tokens.md did not.",
    "Record the token in 02-tokens.md in the same PR.",
    "CLAUDE.md §12",
  );
}

// One highlight on the whole site at a time (repo-wide, not diff-only).
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}
const highlights = [];
for (const f of [...walk("app"), ...walk("components")]) {
  if (inUi(f)) continue;
  const src = readFileSync(f, "utf8");
  const re =
    /variant=["']highlight["']|variant:\s*["']highlight["']|<TextLink(?:Button)?\b[^>]*\shighlight\b/g;
  let m = re.exec(src);
  while (m) {
    highlights.push({
      file: f,
      line: src.slice(0, m.index).split("\n").length,
    });
    m = re.exec(src);
  }
}
if (highlights.length > 1) {
  for (const at of highlights) {
    report(
      "error",
      "highlight-limit",
      at,
      `${highlights.length} highlight CTAs on the site.`,
      "Only one highlight (pill or link) may exist on the whole site at a time. Turn the others back into a plain primary or tertiary.",
      "design-system/02-components.md §1f, §2b",
    );
  }
} else if (highlights.length === 1 && changedFiles.has(highlights[0].file)) {
  report(
    "note",
    "highlight-in-use",
    highlights[0],
    "The site's one highlight CTA is here.",
    "Check that it states its reason, replaces the primary in its fold, and has an end date.",
    "design-system/02-components.md §1f",
  );
}

// ---------- output ----------

const order = { error: 0, warn: 1, note: 2 };
findings.sort(
  (a, b) =>
    order[a.level] - order[b.level] ||
    a.file.localeCompare(b.file) ||
    a.line - b.line,
);
const count = (level) => findings.filter((x) => x.level === level).length;

if (flag("--json")) {
  console.log(
    JSON.stringify(
      { base, mergeBase, changedFiles: [...changedFiles].sort(), findings },
      null,
      2,
    ),
  );
} else {
  console.log(
    `Design audit against ${base} (${changedFiles.size} changed files in scope)`,
  );
  if (!findings.length) {
    console.log(
      "No rule-based findings. The judgment rules still need a reviewer.",
    );
  }
  let lastFile = "";
  for (const x of findings) {
    if (x.file !== lastFile) {
      console.log(`\n${x.file}`);
      lastFile = x.file;
    }
    console.log(
      `  ${x.level.toUpperCase().padEnd(5)} :${x.line}  [${x.rule}] ${x.message}`,
    );
    console.log(`         fix: ${x.fix} (${x.source})`);
  }
  console.log(
    `\n${count("error")} errors, ${count("warn")} warnings, ${count("note")} notes.`,
  );
}

process.exit(flag("--strict") && count("error") > 0 ? 1 : 0);
