
import Link from "next/link";
import { Mail } from "lucide-react";

const footerSections = [
    {
        title: "Shop",
        links: [
            { label: "All Products", href: "/products" },
            { label: "Gaming PCs", href: "/products?category=Gaming%20PCs" },
            { label: "Monitors", href: "/products?category=Monitors" },
            { label: "Keyboards", href: "/products?category=Keyboards" },
            { label: "Gaming Mouse", href: "/products?category=Gaming%20Mouse" },
            { label: "Headsets", href: "/products?category=Headsets" },
        ],
    },
    {
        title: "Customer Support",
        links: [
            { label: "Contact Us", href: "/contact" },
            { label: "FAQs", href: "/faq" },
            { label: "Shipping Information", href: "/shipping" },
            { label: "Returns & Refunds", href: "/returns" },
        ],
    },
    {
        title: "About",
        links: [
            { label: "About Tech O Mech", href: "/about" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms & Conditions", href: "/terms" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-gray-200 bg-gray-900">
            <div className="mx-auto grid max-w-[1900px] gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:px-12">
                {/* Brand section */}
                <div className="lg:col-span-2">
                    <Link
                        href="/"
                        className="inline-block text-2xl font-extrabold italic tracking-tight text-white"
                    >
                        Tech<span className="text-blue-600">O</span>Mech
                    </Link>

                    <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                        Gear up for your next level. Explore gaming PCs, peripherals,
                        and accessories for your ultimate gaming setup.
                    </p>


                    <div className="flex items-center gap-5">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="text-sm font-semibold text-gray-400 transition hover:text-blue-600"
                        >
                            Facebook
                        </a>

                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="text-sm font-semibold text-gray-400 transition hover:text-blue-600"
                        >
                            Instagram
                        </a>

                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="YouTube"
                            className="text-sm font-semibold text-gray-400 transition hover:text-blue-600"
                        >
                            YouTube
                        </a>

                        <a
                            href="mailto:hello@techomech.com"
                            aria-label="Email"
                            className="text-gray-400 transition hover:text-blue-600"
                        >
                            <Mail size={20} aria-hidden="true" />
                        </a>
                    </div>

                </div>

                {/* Footer link sections */}
                {footerSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-sm font-bold text-gray-100">
                            {section.title}
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {section.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 transition hover:text-blue-600"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200">
                <div className="mx-auto flex max-w-[1900px] flex-col gap-2 px-6 py-5 text-sm text-gray-400 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
                    <p>© {new Date().getFullYear()} Tech O Mech. All rights reserved.</p>
                    <p>Built for gamers. Designed for performance.</p>
                </div>
            </div>
        </footer>
    );
}
