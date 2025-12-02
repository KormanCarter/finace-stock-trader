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
            <header className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-blue-200 px-6 py-10 text-white shadow-lg">
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
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center bg-no-repeat p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl relative overflow-hidden"
                        style={{ backgroundImage: "url('/budget.jpg')" }}
                    >
                        <span className="relative z-10 drop-shadow-2xl shadow-black" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Budget Tracker</span>
                    </Link>
                    <Link
                        href="/portfolio"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center bg-no-repeat p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl relative overflow-hidden"
                        style={{ backgroundImage: "url('/stockup.jpg')" }}
                    >
                        <span className="relative z-10 drop-shadow-2xl shadow-black" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Portfolio</span>
                    </Link>
                    <Link
                        href="/buystocks"
                        className="flex h-128 w-full flex-col justify-center rounded-lg border border-gray-200 bg-cover bg-center bg-no-repeat p-6 text-center text-3xl font-bold uppercase tracking-wide text-white transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl relative overflow-hidden"
                        style={{ backgroundImage: "url('/stockimg.jpg')" }}
                    >
                        <span className="relative z-10 drop-shadow-2xl shadow-black" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Buy Stocks</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}