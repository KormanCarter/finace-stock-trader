"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUp from "@/components/signUp";
import SignIn from "@/components/signIn";

export default function Page() {
  const [view, setView] = useState("signup");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      // Redirect to home page if user exists
      router.push("/home");
    }
  }, [router]);

  return (
    <>
      {view === "signin" ? (
        <SignIn onSwitch={() => setView("signup")} />
      ) : (
        <SignUp onSwitch={() => setView("signin")} />
      )}
    </>
  );
}
