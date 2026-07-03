const CONTACT_EMAIL = "hi@meghgupta.com";

// TODO: real copy — swap in real social URLs once available.
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Read.cv", href: "#" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-accent px-6 py-32 text-accent-fg md:px-8 md:py-48"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h2 className="font-serif text-5xl md:text-6xl">Let&apos;s talk.</h2>

        <p className="mt-6 text-xl underline decoration-accent-fg/40 underline-offset-4">
          {CONTACT_EMAIL}
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
          className="mt-8 rounded-md bg-accent-fg px-6 py-3 text-base font-medium text-accent transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
        >
          Email me
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-accent-fg/80">
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 ease-out hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-accent rounded-sm"
              >
                {link.label}
              </a>
              {i < SOCIAL_LINKS.length - 1 && <span aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
