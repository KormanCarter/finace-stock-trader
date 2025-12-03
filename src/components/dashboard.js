"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const [actualExpenses, setActualExpenses] = useState([]);
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [newExpenseCategory, setNewExpenseCategory] = useState('other');
    const [budgetData, setBudgetData] = useState(null);

    // Calculate actual spending by category
    const actualSpendingByCategory = actualExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
        return acc;
    }, {});

    useEffect(() => {
        const loadData = () => {
            // Load current user and their data
            const userRaw = localStorage.getItem("currentUser");
            const user = userRaw ? JSON.parse(userRaw) : null;
            setCurrentUser(user);
            
            if (user?.email) {
                // Load actual expenses (spending)
                const expensesKey = `mansamoneyActualExpenses:${user.email}`;
                const savedExpenses = localStorage.getItem(expensesKey);
                
                // Debug: Log all localStorage keys that contain "expense" or "Expense"
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.includes('expense') || key.includes('Expense'))) {
                        console.log('Found expense key:', key, '=', localStorage.getItem(key));
                    }
                }
                console.log('Looking for key:', expensesKey);
                console.log('Current user email:', user.email);
                console.log('Found data:', savedExpenses);
                
                if (savedExpenses) {
                    try {
                        const parsedExpenses = JSON.parse(savedExpenses);
                        console.log('Parsed expenses:', parsedExpenses);
                        setActualExpenses(Array.isArray(parsedExpenses) ? parsedExpenses : []);
                    } catch (error) {
                        console.log('Parse error:', error);
                        setActualExpenses([]);
                    }
                } else {
                    setActualExpenses([]);
                }

                // Load budget data
                const budgetKey = `mansamoneyBudget:${user.email}`;
                const savedBudget = localStorage.getItem(budgetKey);
                if (savedBudget) {
                    try {
                        setBudgetData(JSON.parse(savedBudget));
                    } catch (error) {
                        setBudgetData(null);
                    }
                }
            }
        };

        loadData();
        
        // Also set up an interval to check for updates every 2 seconds
        const interval = setInterval(loadData, 2000);
        
        return () => clearInterval(interval);
    }, []);

    const addActualExpense = () => {
        if (!newExpenseName.trim() || !newExpenseAmount || Number(newExpenseAmount) <= 0) {
            alert("Please enter a valid expense name and amount");
            return;
        }

        const expenseAmount = Number(newExpenseAmount);
        const remainingBudget = getRemainingBudgetByCategory(newExpenseCategory);
        const categoryLabel = categoryLabels[newExpenseCategory];
        
        // Prevent spending if it would exceed the budget
        if (remainingBudget < expenseAmount) {
            const overspend = expenseAmount - remainingBudget;
            alert(`Cannot record this expense!\n\nExpense amount: $${expenseAmount.toFixed(2)}\nRemaining ${categoryLabel} budget: $${remainingBudget.toFixed(2)}\nOverspend amount: $${overspend.toFixed(2)}\n\nPlease enter an amount of $${remainingBudget.toFixed(2)} or less, or adjust your budget first.`);
            return;
        }

        const expense = {
            id: Date.now(),
            name: newExpenseName.trim(),
            amount: expenseAmount,
            category: newExpenseCategory,
            timestamp: new Date().toISOString()
        };

        const updatedExpenses = [...actualExpenses, expense];
        setActualExpenses(updatedExpenses);
        
        // Save to localStorage
        if (currentUser) {
            const expensesKey = `mansamoneyActualExpenses:${currentUser.email}`;
            localStorage.setItem(expensesKey, JSON.stringify(updatedExpenses));
        }

        // Clear form
        setNewExpenseName('');
        setNewExpenseAmount('');
        setNewExpenseCategory('other');
    };

    const removeActualExpense = (expenseId) => {
        const updatedExpenses = actualExpenses.filter(expense => expense.id !== expenseId);
        setActualExpenses(updatedExpenses);
        
        // Save to localStorage
        if (currentUser) {
            const expensesKey = `mansamoneyActualExpenses:${currentUser.email}`;
            localStorage.setItem(expensesKey, JSON.stringify(updatedExpenses));
        }
    };

    const getRemainingBudgetByCategory = (category) => {
        const budgetAmount = budgetData ? (budgetData[category] || 0) : 0;
        const spentAmount = actualSpendingByCategory[category] || 0;
        return budgetAmount - spentAmount;
    };

    const getTotalBudget = () => {
        if (!budgetData) return 0;
        return Object.values(budgetData).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    };

    const getTotalSpent = () => {
        return Object.values(actualSpendingByCategory).reduce((sum, amount) => sum + amount, 0);
    };

    const categoryLabels = {
        housing: 'Housing',
        food: 'Food',
        groceries: 'Groceries',
        carPayment: 'Car Payment',
        savings: 'Savings',
        investments: 'Investments',
        sports: 'Sports',
        other: 'Other'
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
                    <Link href="/" className="text-blue-600 hover:text-blue-500">
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen px-6 py-12">
            <section className="mx-auto max-w-6xl space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.5em] text-gray-500">
                            MansaMoney
                        </p>
                        <h1 className="text-3xl font-black">Expense Dashboard</h1>
                    </div>
                    <Link
                        href="/home"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        ← Back to Home
                    </Link>
                </header>

                {/* Add New Expense Section */}
                <article className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Record an Expense</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expense Description</label>
                            <input
                                type="text"
                                value={newExpenseName}
                                onChange={(e) => setNewExpenseName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Spent</label>
                            <div className="flex items-center">
                                <span className="text-gray-600">$</span>
                                <input
                                    type="number"
                                    value={newExpenseAmount}
                                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                                    className="flex-1 ml-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Category</label>
                            <select
                                value={newExpenseCategory}
                                onChange={(e) => setNewExpenseCategory(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="housing">Housing</option>
                                <option value="food">Food</option>
                                <option value="groceries">Groceries</option>
                                <option value="carPayment">Car Payment</option>
                                <option value="savings">Savings</option>
                                <option value="investments">Investments</option>
                                <option value="sports">Sports</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={addActualExpense}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Record Expense
                            </button>
                        </div>
                    </div>
                </article>

                {/* Budget vs Spending Overview */}
                {budgetData && (
                    <article className="rounded-2xl border border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-5 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget vs Spending</h2>
                        
                        {/* Overall Summary */}
                        <div className="mb-6 p-4 bg-white rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">Total Budget</p>
                                    <p className="text-2xl font-bold text-blue-600">${getTotalBudget().toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Spent</p>
                                    <p className="text-2xl font-bold text-red-600">${getTotalSpent().toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Remaining</p>
                                    <p className={`text-2xl font-bold ${getTotalBudget() - getTotalSpent() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${(getTotalBudget() - getTotalSpent()).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(categoryLabels).map(([category, label]) => {
                                const budgetAmount = budgetData[category] || 0;
                                const spentAmount = actualSpendingByCategory[category] || 0;
                                const remainingAmount = budgetAmount - spentAmount;
                                const percentageUsed = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
                                
                                return (
                                    <div key={category} className="bg-white rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">{label}</h3>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Budget:</span>
                                                <span className="font-medium">${budgetAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span>Spent:</span>
                                                <span className="font-medium text-red-600">${spentAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>Remaining:</span>
                                                <span className={remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    ${remainingAmount.toFixed(2)}
                                                </span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className={`h-2 rounded-full ${percentageUsed > 100 ? 'bg-red-500' : percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                    style={{width: `${Math.min(percentageUsed, 100)}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 text-center">
                                                {percentageUsed.toFixed(1)}% used
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                )}

                {/* Expense History */}
                <article className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
                    
                    {actualExpenses.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No expenses recorded yet. Record your first expense above!</p>
                    ) : (
                        <div className="space-y-3">
                            {actualExpenses.slice().reverse().map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{expense.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {categoryLabels[expense.category]}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-red-600">-${expense.amount.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">
                                                Remaining: ${getRemainingBudgetByCategory(expense.category).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeActualExpense(expense.id)}
                                        className="ml-4 text-red-600 hover:text-red-800 transition text-sm font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                {/* Quick Actions */}
                <article className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/budget?edit=true&step=tracker&returnTo=/dashboard"
                            className="flex flex-col items-center justify-center bg-cover rounded-lg p-6 hover:shadow-md transition text-center relative overflow-hidden min-h-32"
                            style={{ backgroundImage: "url('/budget.jpg')", backgroundPosition: '50% 20%' }}
                        >
                            <h3 className="relative z-10 font-medium text-white drop-shadow-lg shadow-black">Edit Budget</h3>
                            <p className="relative z-10 text-sm text-white drop-shadow shadow-black">Modify your budget allocations</p>
                        </Link>
                        <Link
                            href="/portfolio"
                            className="flex flex-col items-center justify-center bg-cover bg-center rounded-lg p-6 hover:shadow-md transition text-center relative overflow-hidden min-h-32"
                            style={{ backgroundImage: "url('/stockup.jpg')" }}
                        >
                            
                            <h3 className="relative z-10 font-medium text-white drop-shadow-lg shadow-black">View Portfolio</h3>
                            <p className="relative z-10 text-sm text-white drop-shadow shadow-black">Check your investments</p>
                        </Link>
                        <Link
                            href="/buystocks"
                            className="flex flex-col items-center justify-center bg-cover rounded-lg p-6 hover:shadow-md transition text-center relative overflow-hidden min-h-32"
                            style={{ backgroundImage: "url('/stockimg.jpg')", backgroundPosition: '30% 20%' }}
                        >
                            
                            <h3 className="relative z-10 font-medium text-white drop-shadow-lg shadow-black">Buy Stocks</h3>
                            <p className="relative z-10 text-sm text-white drop-shadow shadow-black">Make new investments</p>
                        </Link>
                    </div>
                </article>
            </section>
        </main>
    );
}