"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="bg-white text-black min-h-screen space-y-8 p-6">
            <header className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 px-6 py-10 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-200 text-center">Welcome to</p>
                <h1 className="text-4xl font-black tracking-tight justify-center text-center">MansaMoney
                    
                </h1>
                
            </header>
            <section className="mx-auto max-w-6xl">
                <h2 className="mb-3 text-lg font-semibold text-gray-800">Featured Sections</h2>
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