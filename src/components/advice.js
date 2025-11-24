"use client";

import React from 'react'

export default function Advice({ investments = 0 }) {
    return (
        <main>
        <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Remaining Stock Balance</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        ${(Number(investments) || 0).toFixed(2)}
                    </p>
                </div>
       
        </main>
    )
}
