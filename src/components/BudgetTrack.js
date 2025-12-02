"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BugetTracker(){
    const router = useRouter()
    const [income, setIncome] = useState('')
    const [housing, setHousing] = useState('')
    const [food, setFood] = useState('')
    const [savings, setSavings] = useState('')
    const [carPayment, setCarPayment] = useState('')
    const [groceries, setGroceries] = useState('')
    const [investments, setInvestments] = useState('')
    const [Sports, setSports] = useState('')
    const [other, setOthers] = useState('')
    const [showRecommended, setShowRecommended] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [remainingInvestment, setRemainingInvestment] = useState(0)

    // Derived remaining balance updates automatically when any dependency changes
    const remainingBalance = (Number(income) || 0)
        - ((Number(housing) || 0)
        + (Number(food) || 0)
        + (Number(savings) || 0)
        + (Number(carPayment) || 0)
        + (Number(groceries) || 0)
        + (Number(investments) || 0)
        + (Number(other) || 0)
        + (Number(Sports) || 0));

    useEffect(() => {
        // Load income from localStorage
        const userRaw = localStorage.getItem("currentUser");
        const user = userRaw ? JSON.parse(userRaw) : null;
        setCurrentUser(user);
        
        if (user) {
            const storageKey = `mansamoneyAmount:${user.email}`;
            const savedIncome = localStorage.getItem(storageKey);
            if (savedIncome) {
                setIncome(savedIncome);
                // Set recommended amounts
                const incomeNum = Number(savedIncome);
                setHousing((incomeNum * 0.30).toFixed(2));
                setFood((incomeNum * 0.12).toFixed(2));
                setSavings((incomeNum * 0.20).toFixed(2));
                setCarPayment((incomeNum * 0.10).toFixed(2));
                setGroceries((incomeNum * 0.10).toFixed(2));
                setInvestments((incomeNum * 0.08).toFixed(2));
            }

            // Calculate remaining investment amount
            const budgetKey = `mansamoneyBudget:${user.email}`;
            const savedBudget = localStorage.getItem(budgetKey);
            
            if (savedBudget) {
                const budgetData = JSON.parse(savedBudget);
                const originalInvestment = Number(budgetData.investments) || 0;
                
                // Get all orders to calculate total spent
                const ordersStorageKey = `mansamoneyOrders:${user.email}`;
                const ordersRaw = localStorage.getItem(ordersStorageKey);
                const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
                
                // Calculate total amount spent on all purchases
                const totalSpent = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
                
                // Set remaining investment
                setRemainingInvestment(Math.max(0, originalInvestment - totalSpent));
            }
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Check if at least one field is filled
        if (!housing && !food && !savings && !carPayment && !groceries && !investments) {
            alert("Please fill out at all of the categories");
            return;
        }
        
        // Get current user from localStorage
        const userRaw = localStorage.getItem("currentUser");
        const currentUser = userRaw ? JSON.parse(userRaw) : null;
        
        if (!currentUser) {
            alert("Please sign in first");
            return;
        }
        
        // Calculate remaining balance
        const totalExpenses = (Number(housing) || 0) + (Number(food) || 0) + (Number(savings) || 0) + (Number(carPayment) || 0) + (Number(groceries) || 0) + (Number(investments) || 0) + (Number(other) || 0) + (Number(Sports) || 0);
        const remainingBalance = Number(income) - totalExpenses;
        
        // Check if remaining balance is negative
        if (remainingBalance < 0) {
            alert(`Way to much their pal your not rich enough for that!`);
            return;
        }
        
        const budgetData = {
            housing: Number(housing) || 0,
            food: Number(food) || 0,
            savings: Number(savings) || 0,
            carPayment: Number(carPayment) || 0,
            groceries: Number(groceries) || 0,
            investments: Number(investments) || 0,
            other: Number(other) || 0,
            Sports: Number(Sports) || 0,
            timestamp: new Date().toISOString()
        }
        
        
        const storageKey = `mansamoneyBudget:${currentUser.email}`;
        localStorage.setItem(storageKey, JSON.stringify(budgetData));
        
        router.push('/advice');
    }

    return (
        <main className="min-h-screen px-6 py-12">
            <section className="mx-auto max-w-5xl space-y-6">
                <header>
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                        MansaMoney
                    </p>
                    <h1 className="text-3xl font-black">Budget Tracker</h1>
                    <Link
                        href="/budget?edit=true"
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                        ← Back to Income Entry
                    </Link>
                </header>

                {/* Remaining Budget Balance Display */}
                {income && (
                    <article className={`rounded-2xl border border-gray-200 px-6 py-5 shadow-sm ${
                        remainingBalance >= 0 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-300' 
                            : 'bg-gradient-to-r from-red-50 to-red-300'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <p className={`text-sm uppercase tracking-[0.4em] ${
                                    remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    Remaining Budget Balance
                                </p>
                                <p className={`text-4xl font-bold ${
                                    remainingBalance >= 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    ${remainingBalance.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </article>
                )}

                <article className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Budget Allocations</h2>
                        
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Housing</label>
                                    <button
                                        type="button"
                                        onClick={() => setHousing((Number(income) * 0.30).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={housing}
                                        onChange={(e) => setHousing(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Food</label>
                                    <button
                                        type="button"
                                        onClick={() => setFood((Number(income) * 0.12).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={food}
                                        onChange={(e) => setFood(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Savings</label>
                                    <button
                                        type="button"
                                        onClick={() => setSavings((Number(income) * 0.20).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={savings}
                                        onChange={(e) => setSavings(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Car Payment</label>
                                    <button
                                        type="button"
                                        onClick={() => setCarPayment((Number(income) * 0.10).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={carPayment}
                                        onChange={(e) => setCarPayment(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Groceries</label>
                                    <button
                                        type="button"
                                        onClick={() => setGroceries((Number(income) * 0.10).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={groceries}
                                        onChange={(e) => setGroceries(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/60 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-600">Investments</label>
                                    <button
                                        type="button"
                                        onClick={() => setInvestments((Number(income) * 0.08).toFixed(2))}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                                    >
                                        Recommended
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={investments}
                                        onChange={(e) => setInvestments(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                             <div className="rounded-xl bg-white/60 p-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Sports</label>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={Sports}
                                        onChange={(e) => setSports(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                        </div>
                        <div className="rounded-xl bg-white/60 p-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Other</label>
                                <div className="flex items-center">
                                    <span className="text-gray-600">$</span>
                                    <input 
                                        type="number" 
                                        value={other}
                                        onChange={(e) => setOthers(e.target.value)}
                                        className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        placeholder="0.00"
                                    />
                                </div>
                        </div>
                        </div>
                        <button 
                            type="submit"
                            className="w-full mt-6 rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                            Save Budget
                        </button>
                    </form>
                </article>
            </section>
        </main>
    )
}