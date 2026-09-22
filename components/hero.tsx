import { ProductVenn } from "@/components/product-venn";

export function Hero() {
  return (
    <section id="hero" className="px-6 pt-24 pb-16 md:px-8 md:pt-32 md:pb-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0">
          <p
            className="mb-4 text-3xl leading-[1] text-accent md:text-4xl"
            style={{ fontFamily: "var(--font-hand), cursive" }}
          >
            Hi, I am Megh.
          </p>

          <h1 className="font-serif text-[3rem] leading-[1.05] tracking-tight text-fg md:text-[4rem]">
            I turn ideas into features,
            <br className="hidden md:block" /> features into products,
            <br className="hidden md:block" /> products into systems.
          </h1>

          <div className="mt-10">
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
