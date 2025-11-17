"use client";

import { useAuth } from "./AuthContext";

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <h1>Auth Status: {isAuthenticated ? "Logged In ✅" : "Logged Out ❌"}</h1>

      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}