
import Image from "next/image";
import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BenefitsSection from "@/components/BenefitsSection";

export default function Home() {
  return (
    <>
      <main className="bg-white text-gray-900">

        {/* Mobile Hero Section */}
        <section className="bg-[#07111f] sm:hidden">

          {/* Gaming setup image */}
          <div className="relative aspect-[2/1] w-full overflow-hidden">
            <Image
              src="/hero-gaming-setup.png"
              alt="Complete gaming setup with a gaming PC, monitor, keyboard, and headset"
              fill
              priority
              sizes="100vw"
              className="object-cover scale-130 object-[70%_center]"
            />
          </div>

          {/* Mobile hero content */}
          <div className="px-6 py-8">
            <div className="max-w-xl">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Premium Gaming Hardware
              </p>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                Build Your
                <span className="block text-blue-500">
                  Next Level.
                </span>
              </h1>

              <p className="mt-4 text-base leading-7 text-gray-200">
                Discover gaming PCs, monitors, peripherals, and everything you need to build your ultimate gaming setup.
              </p>

              <div className="mt-6 flex flex-col gap-3">

                <Link
                  href="/products?category=Gaming%20PCs"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Shop Gaming PCs
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  Explore Accessories
                  <span aria-hidden="true">→</span>
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* Desktop Hero Section - Original Design */}
        <section className="relative isolate hidden min-h-[480px] items-center overflow-hidden sm:flex lg:min-h-[520px]">

          {/* Background image */}
          <Image
            src="/hero-gaming-setup.png"
            alt="Gaming setup with a gaming PC, monitor, keyboard, and headset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Desktop hero content */}
          <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 py-16 sm:px-8 lg:px-12">
            <div className="max-w-xl">

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 sm:text-sm">
                Premium Gaming Hardware
              </p>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build Your
                <span className="block text-blue-500">
                  Next Level.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-gray-200 sm:text-lg">
                Discover gaming PCs, monitors, peripherals, and everything you need to build your ultimate gaming setup
              </p>

              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">

                <Link
                  href="/products?category=Gaming%20PCs"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Shop Gaming PCs
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore Accessories
                  <span aria-hidden="true">→</span>
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* Other Homepage Sections */}
        <CategorySection />
        <FeaturedProducts />
        <BenefitsSection />

      </main>
    </>
  );
}
