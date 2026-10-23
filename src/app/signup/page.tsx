
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function getSafeReturnPath() {
        const next = searchParams.get("next");

        if (!next || !next.startsWith("/") || next.startsWith("//")) {
            return "/";
        }

        return next;
    }

    async function handleSignup() {
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.session) {
            router.replace(getSafeReturnPath());
            router.refresh();
            return;
        }

        setSuccess("Your account was created. Please sign in to continue.");
    }

    return (
        <main className="min-h-screen bg-white px-4 py-12 text-gray-900 sm:px-6">
            <div className="mx-auto max-w-md">
                <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create an account
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Create your Tech O Mech account.
                    </p>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSignup();
                        }}
                        className="mt-8 space-y-5"
                    >
                        {/* Full name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Full name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(event) =>
                                    setFullName(event.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Create a password"
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

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 [&::-ms-reveal]:hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) => !current
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {/* Success */}
                        {success && (
                            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href={`/login?next=${encodeURIComponent(searchParams.get("next") || "/")}`}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
