export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-fg-subtle">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
