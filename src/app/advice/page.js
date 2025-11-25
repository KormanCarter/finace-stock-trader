"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Advice from "@/components/advice";

export default function AdvicePage() {
    const [investments, setInvestments] = useState(0)

    useEffect(() => {
        // Load investments amount from budget in localStorage
        const userRaw = localStorage.getItem("currentUser");
        const currentUser = userRaw ? JSON.parse(userRaw) : null;
        
        if (currentUser) {
            const budgetKey = `mansamoneyBudget:${currentUser.email}`;
            const savedBudget = localStorage.getItem(budgetKey);
            if (savedBudget) {
                const budgetData = JSON.parse(savedBudget);
                setInvestments(budgetData.investments || 0);
            }
        }
    }, [])

    return (
        <main className="min-h-screen m-0 p-0 w-screen">
            <section className="m-0 p-0 w-screen space-y-6">
                <header className="px-6 pt-6 pb-2 space-y-2">
                    <p className="inline-block rounded-md bg-blue-100 px-4 py-2 text-xs uppercase tracking-[0.5em] text-blue-700">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black px-2">Investment Advice</h1>
                    <div className="flex gap-3">
                        <Link
                            href="/home"
                            className="inline-flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                        >
                            ← Back
                        </Link>
                        <Link
                            href="/budget?edit=true&step=tracker"
                            className="inline-flex items-center rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition"
                        >
                            Edit Budget
                        </Link>
                    </div>
                </header>

                <Advice investments={investments} />
            </section>
        </main>
    );
}
