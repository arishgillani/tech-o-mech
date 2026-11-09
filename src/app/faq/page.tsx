
const faqs = [
  {
    question: "What is Tech O Mech?",
    answer:
      "Tech O Mech is a demonstration e-commerce website showcasing gaming PCs, monitors, keyboards, mice, headsets, and gaming accessories.",
  },
  {
    question: "Can I purchase products from this website?",
    answer:
      "Tech O Mech is a portfolio demonstration project. It does not process real payments or fulfill physical product orders.",
  },
  {
    question: "Do I need an account to browse products?",
    answer:
      "No. You can browse the product catalog without an account. However, signing in is required for account-related features such as viewing your orders.",
  },
  {
    question: "Can I add products to my cart?",
    answer:
      "Yes. You can add products to your cart, update quantities, and explore the demo checkout experience.",
  },
  {
    question: "How can I view my orders?",
    answer:
      "Sign in to your account and visit the Orders section to view your demo order history and order statuses.",
  },
  {
    question: "How do I manage my wishlist?",
    answer:
      "You can use the wishlist feature on product pages to save products you are interested in exploring.",
  },
  {
    question: "Does Tech O Mech offer real shipping and returns?",
    answer:
      "No. Since this is a demonstration website, products are not physically shipped and real returns or refunds are not processed.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 p-60 pt-16 pb-0 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Help Center
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Find answers to common questions about Tech O Mech and how the
          website works.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {faq.question}

                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-gray-100 pt-4 leading-7 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
