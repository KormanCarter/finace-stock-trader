"use client";

import { useState } from "react";
export default function Enter(){
    const [amount, setAmount] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = Number(amount);
        
        if (!amount || numAmount <= 0 || isNaN(numAmount)){
            alert("please enter a valid dollar amount");
            return;
        }
        
        // Get current user from localStorage
        const userRaw = localStorage.getItem("currentUser");
        const currentUser = userRaw ? JSON.parse(userRaw) : null;
        
        if (!currentUser) {
            alert("Please sign in first");
            return;
        }
        
        // Save to localStorage with user email as key
        const storageKey = `mansamoneyAmount:${currentUser.email}`;
        localStorage.setItem(storageKey, amount);
        
        // Handle successful submission here
        console.log("Amount submitted:", numAmount);
        alert("Amount saved successfully!");
    }
    
    return(
        <main>
        <h1>MansaMoney</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="amount">
                  Amount $
                </label>
                <input
                  id="amount"
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50 text-gray-900"
                  placeholder="1000"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
        </form>
        </main>
    )
}