
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center">
                    <p className="text-gray-500">Loading sign in...</p>
                </main>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
