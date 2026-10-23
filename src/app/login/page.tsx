
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function getSafeReturnPath() {
        const next = searchParams.get("next");

        if (!next || !next.startsWith("/") || next.startsWith("//")) {
            return "/";
        }

        return next;
    }

    async function handleLogin() {
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        router.replace(getSafeReturnPath());
        router.refresh();
    }

    return (
        <main className="min-h-screen bg-white px-4 py-12 text-gray-900 sm:px-6">
            <div className="mx-auto max-w-md">
                <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Sign in
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your Tech O Mech account.
                    </p>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleLogin();
                        }}
                        className="mt-8 space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 [&::-ms-reveal]:hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href={`/signup?next=${encodeURIComponent(searchParams.get("next") || "/")}`}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
