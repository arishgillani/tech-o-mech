
import Link from "next/link";
import Image from "next/image";


const categories = [
    {
        name: "Gaming PCs",
        href: "/products?category=Gaming%20PCs",
        image: "/categories/gaming-pcs.png",
    },
    {
        name: "Monitors",
        href: "/products?category=Monitors",
        image: "/categories/monitors.png",
    },
    {
        name: "Keyboards",
        href: "/products?category=Keyboards",
        image: "/categories/keyboards.png",
    },
    {
        name: "Gaming Mice",
        href: "/products?category=Gaming%20Mouse",
        image: "/categories/gaming-mice.png",
    },
    {
        name: "Headsets",
        href: "/products?category=Headsets",
        image: "/categories/headsets.png",
    },
    {
        name: "Gaming Chairs",
        href: "/products?category=Gaming%20Chairs",
        image: "/categories/gaming-chairs.png",
    },
];

export default function CategorySection() {
    return (
        <section className="mx-auto w-full max-w-[1900px] p-6 sm:px-8 lg:px-12">
            {/* Section heading */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Shop by Category
                </h2>

                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    Find the gear for your next gaming setup.
                </p>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">


                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="group flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-300 bg-gray-50 p-4 transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md"
                    >
                        <div className="relative h-32 w-full">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                                className="object-contain transition duration-200 group-hover:scale-105"
                            />
                        </div>

                        <h3 className="text-center text-sm font-semibold text-gray-800 transition group-hover:text-blue-600 sm:text-base">
                            {category.name}
                        </h3>
                    </Link>
                ))}


            </div>
        </section>
    );
}
