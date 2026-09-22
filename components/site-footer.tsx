export function SiteFooter() {
  return (
    <footer className="px-6 py-10 text-center md:px-8">
      <p className="text-xs text-fg-subtle">
        © 2026 Megh Gupta · Built with{" "}
        <a
          href="https://claude.ai/code"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-fg"
        >
          Claude Code
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/medigitaldiary/megh-gupta-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-fg"
        >
          Source
        </a>
      </p>
    </footer>
  );
}
