"use client";

import React, { useState } from 'react'
import Link from "next/link";

export default function Advice({ investments = 0 }) {
    const [indexfund,setIndexFund] = useState("")
    const [topSeven,setTopSeven] = useState("")
    return (
        <main className="min-h-screen bg-white">
            <section className="mx-auto max-w-7xl space-y-6 px-6">
                {/* Amount Left to Invest */}
                <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Amount Left to Invest</p>
                        <p className="text-3xl font-bold text-blue-600">
                            ${(Number(investments) || 0).toFixed(2)}
                        </p>
                    </div>
                </article>

                <div className="grid grid-cols-3 gap-4">
                    {/* Portfolio Image Card */}
                    <div className="col-span-1 row-span-2">
                        <Link
                            href="/portfolio"
                            className="flex h-116 w-full flex-col rounded-2xl border border-gray-200 bg-cover bg-center p-6 text-2xl font-bold uppercase tracking-wide text-purple-500 transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-white/70 hover:shadow-2xl"
                            style={{ backgroundImage: "url('/stockup.jpg')" }}
                        >
                            Portfolio
                        </Link>
                    </div>

                    
                    <article className="h-116 w-full rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm flex flex-col">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Index Funds</p>
                            <p className="text-xl font-bold text-gray-600">This evenly invest your money into the top 2 index funds</p>
                            <ul className="list-disc pl-6 space-y-1 font-semibold text-lg">
                                    <li>VOO</li>
                                    <li>QQQ</li>
                                </ul>
                                <div className="flex items-center gap-3 mt-3">
                                    <input 
                                        type="number" 
                                        value={indexfund}
                                        onChange={(e) => setIndexFund(e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                    <button className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]">
                                        <span className="relative z-10">Submit</span>
                                    </button>
                                </div>
                        </div>
                    </article>

                    
                    <article className="h-116 w-full rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm flex flex-col">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Top 7 Stocks</p>
                            <div className="text-gray-600">
                                <p className="text-2xl font-bold mb-2">This evenly invests your money into the top 7 stocks:</p>
                                <ul className="list-disc pl-6 space-y-1 font-semibold text-lg">
                                    <li>NVIDIA (NVDA)</li>
                                    <li>Apple Inc. (AAPL)</li>
                                    <li>Microsoft Corporation (MSFT)</li>
                                    <li>Alphabet Inc. (GOOGL)</li>
                                    <li>Amazon.com Inc. (AMZN)</li>
                                    <li>Broadcom Inc. (AVGO)</li>
                                    <li>Saudi Arabian Oil Company (2222)</li>
                                </ul>
                                <div className="flex items-center gap-3 mt-3">
                                    <input 
                                        type="number" 
                                        value={topSeven}
                                        onChange={(e) => setTopSeven(e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                    <button className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition [background-size:200%_100%] hover:[background-position:100%_0] hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.97]">
                                        <span className="relative z-10">Submit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                </div>
            </section>
        </main>
    );
}
