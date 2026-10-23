
import { Truck, RefreshCw, ShieldCheck, Headset } from "lucide-react";

const benefits = [
  {
    title: "Free Shipping",
    description: "On orders over $50",
    icon: Truck,
  },
  {
    title: "Easy Returns",
    description: "Hassle-free returns",
    icon: RefreshCw,
  },
  {
    title: "Secure Shopping",
    description: "A safe shopping experience",
    icon: ShieldCheck,
  },
  {
    title: "Customer Support",
    description: "We're here to help",
    icon: Headset,
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-white px-6 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className="flex items-center gap-4 rounded-xl border border-blue-400 bg-blue-100 px-5 py-6 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
