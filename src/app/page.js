"use client";

import React, { useState } from "react";
import SignUp from "@/components/signUp";
import SignIn from "@/components/signIn";

export default function Page() {
  const [view, setView] = useState("signup");

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
