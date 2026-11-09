
import { Suspense } from "react";
import SignupForm from "./SignupForm";

export default function SignupPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center">
                    <p className="text-gray-500">Loading sign up...</p>
                </main>
            }
        >
            <SignupForm />
        </Suspense>
    );
}
