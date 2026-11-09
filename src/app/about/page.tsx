
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 px-6 py-16 text-center sm:py-15">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          About Us
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
          About Tech O Mech
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Your destination for exploring gaming hardware, computer
          accessories, and technology built for performance.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Who We Are
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Tech O Mech is a computer hardware and gaming technology
              showcase designed for people who enjoy exploring modern
              technology and gaming setups.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              From gaming desktops and high-refresh-rate monitors to
              keyboards, mice, headsets, and gaming chairs, our platform
              brings a variety of hardware products together in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              What We Showcase
            </h2>

            <ul className="mt-6 space-y-4 text-gray-600">
              {[
                "Gaming PCs and performance hardware",
                "Gaming monitors and displays",
                "Keyboards and gaming mice",
                "Headsets and audio accessories",
                "Gaming chairs and setup essentials",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Built Around Technology
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Our goal is to provide a clean and easy-to-use shopping
            experience where visitors can explore products, manage
            wishlists, add items to their cart, and track demo orders.
          </p>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          Tech O Mech is a demonstration e-commerce project. It does not
          process real payments or sell physical products.
        </p>
      </section>
    </main>
  );
}
