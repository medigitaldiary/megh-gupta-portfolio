import Image from "next/image";
import { ProductVenn } from "@/components/product-venn";

export function Hero() {
  return (
    <section id="hero" className="px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          {/* Avatar + handwritten greeting sit on the same row; the
              avatar's left edge aligns with the H1 below. The avatar
              replaces the earlier sun icon pseudo-element: removing
              the data-hero-greeting attribute neutralises that rule
              in app/globals.css without touching the global stylesheet. */}
          <div className="mb-3 flex items-center gap-4 md:gap-[18px]">
            <Image
              src="/images/hero-portrait.webp"
              alt="Megh Gupta, portrait avatar"
              width={128}
              height={128}
              priority
              className="h-[44px] w-[44px] shrink-0 rounded-full md:h-[56px] md:w-[56px]"
              style={{
                filter: "drop-shadow(0 2px 8px rgba(31, 59, 46, 0.18))",
              }}
            />
            <p
              className="text-3xl leading-[1] text-accent md:text-[2.25rem]"
              style={{ fontFamily: "var(--font-hand), cursive" }}
            >
              Hi, I am Megh.
            </p>
          </div>

          <h1 className="font-serif text-[2.25rem] leading-[1.08] tracking-tight text-fg md:text-[3rem] lg:text-[3.25rem]">
            <span className="block">
              I turn ideas into <span data-hl-word>features</span>,
            </span>
            <span className="block">
              features into <span data-hl-word>products</span>,
            </span>
            <span className="block">
              products into <span data-hl-word>systems</span>.
            </span>
          </h1>

          <div className="mt-8">
            <a
              href="#connect"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Let&apos;s connect →
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <ProductVenn />
        </div>
      </div>
    </section>
  );
}
