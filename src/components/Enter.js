"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Enter(){
    const router = useRouter();
    const [amount, setAmount] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = Number(amount);
        
        if (!amount || numAmount <= 0 || isNaN(numAmount)){
            alert("please enter a valid dollar amount");
            return;
        }
        
        
        const userRaw = localStorage.getItem("currentUser");
        const currentUser = userRaw ? JSON.parse(userRaw) : null;
        
        if (!currentUser) {
            alert("Please sign in first");
            return;
        }
        
       
        const storageKey = `mansamoneyAmount:${currentUser.email}`;
        localStorage.setItem(storageKey, amount);
        
        
        console.log("Amount submitted:", numAmount);
        alert("Amount saved successfully!");
        
        // Navigate to budget tracker
        router.push("/budget?step=tracker");
    }
    
    return(
        <main className="min-h-screen bg-white px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Enter Monthly income</h1>
                </header>

                <article className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="rounded-xl bg-white/60 p-4">
                            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="amount">
                                Income
                            </label>
                            <div className="flex items-center">
                                <span className="text-gray-600">$</span>
                                <input
                                  id="amount"
                                  className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                  placeholder="0.00"
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="w-full mt-6 rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                            Save Income
                        </button>
                    </form>
                </article>
            </section>
        </main>
    )
}