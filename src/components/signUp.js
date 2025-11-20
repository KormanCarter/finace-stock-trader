"use client";

import React, { useState } from 'react'

export default function SignUp({ onSwitch }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. user@example.com).')
      return
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be 8+ chars and include upper, lower, and a number.')
      return
    }

    const existing = JSON.parse(localStorage.getItem('signupCredentials') || 'null');
    if (existing && existing.email === email.trim()) {
      setError('That user has already been created, please sign in instead.');
      return;
    }

    try {
      const user = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem('signupCredentials', JSON.stringify(user))
      setSuccess('Credentials saved locally. Redirecting to sign in...')
      alert("Success! You may sign in now.");

      if (typeof onSwitch === 'function') {
        onSwitch()
      }
      
    } catch (err) {
      console.error('Failed to save credentials', err)
      setError('Unable to save credentials. Please try again.')
    }
  }

  return (
    <div className="app-root min-h-screen flex flex-col items-center justify-start bg-gray-300/30 px-4 py-10">
      <div className="mb-6 text-4xl font-black tracking-tight text-white drop-shadow-sm">
        MansaMoney
      </div>
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-300">Enter your details below to get started.</p>
        </div>

        <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
          
          <div
            className="text-2xl font-bold text-blue-600 underline cursor-pointer sign-in"
            onClick={onSwitch}
          >
            Sign in
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="signup-full-name">
              Full name
            </label>
            <input
              id="signup-full-name"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50 text-gray-900"
              placeholder="Your full name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50 text-gray-900"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50 text-gray-900"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign up
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </form>
      </div>
    </div>
  )
}
