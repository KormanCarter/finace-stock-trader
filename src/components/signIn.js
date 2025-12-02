"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn({ onSwitch }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const stored = localStorage.getItem('signupCredentials')
      if (!stored) {
        setError('No account found. Please sign up first.')
        return
      }

      let users = JSON.parse(stored)
      
      // Handle legacy single user format - convert to array
      if (!Array.isArray(users)) {
        users = [users]
      }
      
      const user = users.find(u => u.email === email.trim())
      
      if (!user) {
        setError('Email does not match any saved account.')
        return
      }

      if (user.password !== password) {
        setError('Incorrect password. Please try again.')
        return
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify({ fullName: user.fullName, email: user.email, signedInAt: new Date().toISOString() })
      )

      console.log('Sign in successful — email:', email)
      router.push('/home')
    } catch (err) {
      console.error('Sign in failed', err)
      setError('Unable to sign in. Please try again later.')
    }
  }

  return (
    <div className="app-root min-h-screen flex flex-col items-center justify-start bg-gray-300/30 px-4 py-10">
      <div className="mb-6 text-4xl font-black tracking-tight text-white drop-shadow-sm">
        MansaMoney
      </div>
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-gray-300">Welcome back — enter your credentials.</p>
        </div>

        <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
          {/* clickable text to switch to Sign Up view */}
          <div
            className="text-2xl font-bold text-blue-600 underline cursor-pointer sign-in"
            onClick={onSwitch}
          >
            Sign Up
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="signin-email">
              Email
            </label>
            <input
              id="signin-email"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50 text-gray-900"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="signin-password">
              Password
            </label>
            <input
              id="signin-password"
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
            Sign In
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  )
}
