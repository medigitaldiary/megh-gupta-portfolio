import { CalEmbed } from "@/components/cal-embed";

const FALLBACK_EMAIL = "megh.bpgc@gmail.com";

export function Contact() {
  return (
    <section
      id="connect"
      className="scroll-mt-16 bg-accent px-6 py-32 text-accent-fg md:px-8 md:py-48"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h2 className="font-serif text-[3rem] leading-[1.05] tracking-tight md:text-[4rem]">
          Let&apos;s Connect.
        </h2>

        <p className="mt-8 text-base leading-[1.6] text-accent-fg/85 md:text-lg">
          If you&apos;re working in fintech/wealthtech, product, or the
          early-stage startup world - I&apos;d love to hear from you.
          <br className="hidden min-[1100px]:block" />
          Whether it&apos;s to swap notes, jam on a product problem, or talk
          about fixed income and financial access.
        </p>
      </div>

      {/* Month view snaps to a 1040px booker at Cal's 1024px breakpoint.
          Below that, cap at 1000px so the frame never sits in the 1024–1039px
          band, which is what forces both scrollbars. 1104 = 1040 + section px-8. */}
      <div className="mx-auto mt-10 w-full max-w-[1000px] min-[1104px]:max-w-[1040px]">
        <CalEmbed />
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-accent-fg/70">
        calendars not your thing?{" "}
        <a
          href={`mailto:${FALLBACK_EMAIL}`}
          className="underline decoration-accent-fg/50 underline-offset-4 transition-opacity duration-150 hover:opacity-90"
        >
          {FALLBACK_EMAIL}
        </a>{" "}
        works just as well.
      </p>
    </section>
  );
}
