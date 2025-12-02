"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Enter from "@/components/Enter";
import BugetTracker from "@/components/BudgetTrack";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BudgetPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const step = searchParams.get("step");

    useEffect(() => {
        // Check if user wants to edit (has edit parameter) - skip redirect
        const isEditing = searchParams.get("edit") === "true";
        if (isEditing) return;
        
        // Check if user already has a budget
        const userRaw = localStorage.getItem("currentUser");
        const currentUser = userRaw ? JSON.parse(userRaw) : null;
        
        if (currentUser) {
            const budgetKey = `mansamoneyBudget:${currentUser.email}`;
            const savedBudget = localStorage.getItem(budgetKey);
            
            // If they have a budget, redirect to advice page
            if (savedBudget) {
                router.push('/advice');
                return;
            }
        }
    }, [router, searchParams]);
    
    return (
        <ProtectedRoute>
            <main>
                {step === "tracker" ? <BugetTracker /> : <Enter />}
            </main>
        </ProtectedRoute>
    );
}
