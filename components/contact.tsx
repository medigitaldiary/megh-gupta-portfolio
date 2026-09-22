import { CalEmbed } from "@/components/cal-embed";

const FALLBACK_EMAIL = "megh.bpgc@gmail.com";

export function Contact() {
  return (
    <section
      id="connect"
      className="scroll-mt-16 bg-accent px-6 py-24 text-accent-fg md:px-8 md:py-32"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          Let&apos;s Connect.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-accent-fg/85 md:text-xl">
          If you&apos;re working in fintech/wealthtech, product, or the
          early-stage startup world - I&apos;d love to hear from you. Whether
          it&apos;s to swap notes, jam on a product problem, or talk about fixed
          income and financial access, feel free to reach out.
        </p>

        <div className="mt-12 w-full">
          <CalEmbed />
        </div>

        <p className="mt-8 max-w-xl text-base text-accent-fg/75">
          calendars not your thing?{" "}
          <a
            href={`mailto:${FALLBACK_EMAIL}`}
            className="underline decoration-accent-fg/50 underline-offset-4 transition-opacity duration-150 hover:opacity-90"
          >
            {FALLBACK_EMAIL}
          </a>{" "}
          works just as well.
        </p>
      </div>
    </section>
  );
}
