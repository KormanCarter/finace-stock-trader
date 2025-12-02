"use client";

import { AuthProvider } from "@/components/AuthContext";

export default function ClientAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}