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
        <main className="min-h-screen bg-white px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Investment Advice</h1>
                    <Link
                        href="/home"
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                        ← Back
                    </Link>
                </header>

                <Advice investments={investments} />
            </section>
        </main>
    );
}
