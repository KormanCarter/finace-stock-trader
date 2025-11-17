"use client";

import Search from "@/components/search";

export default function Home() {
    return (
                <main className="bg-white text-black min-h-screen p-6">
                    {/* Top: Search bar */}
                    <Search />

                    {/* Row with 10 boxes */}
                    <section className="max-w-6xl mx-auto mb-6">
                        <h2 className="text-lg font-semibold mb-3">Top Row (10 boxes)</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex: 0 0 auto w-40 h-40 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-sm font-medium"
                                    style={{ minWidth: 160 }}
                                >
                                    Box {i + 1}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Row with 2 boxes */}
                    <section className="max-w-6xl mx-auto">
                        <h2 className="text-lg font-semibold mb-3">Second Row (2 boxes)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className="w-full h-90 border border-gray-200 rounded-md flex justify-center p-8 text-3xl font-bold uppercase tracking-wide text-white text-center bg-cover bg-center"
                                    style={{ backgroundImage: "url('/safebuy.webp')" }}
                                >
                                    Safest Buys
                                </div>
                                <div
                                    className="w-full h-90 border border-gray-200 rounded-md flex justify-center p-8 text-3xl font-bold uppercase tracking-wide text-green-100 text-center bg-cover bg-center"
                                    style={{ backgroundImage: "url('/stockup.jpg')" }}
                                >
                                    Portfolio
                                </div>
                        </div>
                        
                    </section>
                </main>
    );
}