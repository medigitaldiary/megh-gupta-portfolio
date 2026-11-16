import { CopyEmailButton } from "@/components/copy-email-button";
import { ButtonLink, buttonStyles, CtaArrow, TextLink } from "@/components/ui";

const EMAIL = "megh.bpgc@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";

type Props = {
  /** Where "Book 20 min" goes (the Contact fold with the booking calendar). */
  connectHref: string;
  className?: string;
};

/**
 * End-of-study contact block (G-M1, option #1). Sits between the last
 * section and "Keep reading", where a reader has just finished the
 * evidence. Book a call, copy the email, or open LinkedIn.
 */
export function CaseStudyContact({ connectHref, className = "" }: Props) {
  return (
    <section
      aria-labelledby="case-study-contact"
      className={`mt-20 rounded-2xl border border-border bg-bg-elevated p-6 md:p-9 ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
        That&apos;s the case study
      </p>
      <h2
        id="case-study-contact"
        className="mt-3 font-display text-[1.75rem] leading-tight font-semibold text-fg md:text-[2.125rem]"
      >
        Want the story behind the numbers?
      </h2>
      <p className="mt-3 leading-relaxed text-fg-muted">
        20 minutes, your questions. I&apos;ll walk you through the decisions,
        the tradeoffs and what I&apos;d change.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <ButtonLink href={connectHref} size="touch">
          Book 20 min <CtaArrow />
        </ButtonLink>
        <CopyEmailButton
          email={EMAIL}
          label="Copy email"
          className={buttonStyles({ variant: "secondary", size: "touch" })}
        />
        <TextLink href={LINKEDIN_URL} direction="external">
          LinkedIn
        </TextLink>
      </div>
    </section>
  );
}
