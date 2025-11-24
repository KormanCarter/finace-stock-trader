"use client";

import { useSearchParams } from "next/navigation";
import Enter from "@/components/Enter";
import BugetTracker from "@/components/BudgetTrack";

export default function BudgetPage() {
    const searchParams = useSearchParams();
    const step = searchParams.get("step");
    
    return (
       <main>
        {step === "tracker" ? <BugetTracker /> : <Enter />}
       </main>
    );
}
