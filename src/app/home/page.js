"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleSignOut = () => {
        // Clear user session data
        localStorage.removeItem("currentUser");
        // Redirect to signin page
        router.push("/");
    };

    return (
        <main className="text-black min-h-screen space-y-8 p-6">
            <header className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 px-6 py-10 text-white shadow-lg">
                <div className="flex justify-between items-start">
                    <div className="flex-1 text-center">
                        <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Welcome to</p>
                        <h1 className="text-4xl font-black tracking-tight">MansaMoney</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="rounded-lg bg-blue-300 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign Out
                    </button>
                </div>
            </header>
            <section className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Link
                        href="/budget"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/budget.jpg')" }}
                    >
                        Budget Tracker
                    </Link>
                    <Link
                        href="/portfolio"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-purple-500 transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/stockup.jpg')" }}
                    >
                        Portfolio
                    </Link>
                    <Link
                        href="/buystocks"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center p-6 text-center text-3xl font-bold uppercase tracking-wide text-red-400 transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                        style={{ backgroundImage: "url('/stockimg.jpg')" }}
                    >
                        Buy Stocks
                    </Link>
                </div>
            </section>
        </main>
    );
}