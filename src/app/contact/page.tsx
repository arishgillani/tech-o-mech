
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 px-6 py-16 pb-0 text-center ">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Get in Touch
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
          Contact Us
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Have a question about Tech O Mech? We would love to hear from you.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              How Can We Help?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you have questions about products, orders, or the
              website, this page is here to guide you.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Customer Support
                </h3>
                <p className="mt-1 text-gray-600">
                  For general questions and assistance, use the contact
                  form.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Order Information
                </h3>
                <p className="mt-1 text-gray-600">
                  You can view your demo order history from your account.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This is a demonstration contact form and does not send
              messages to a support team.
            </p>

            <form className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Enter subject"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white opacity-70"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
