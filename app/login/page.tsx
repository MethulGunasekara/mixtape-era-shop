'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-black font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-md border-4 border-brand-black bg-white p-8 shadow-button">
        <h1 className="text-4xl font-black uppercase mb-8 text-center">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-100 border-2 border-brand-red rounded-md text-sm font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-brand-black rounded-md font-mono bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-brand-black rounded-md font-mono bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-brand-red text-white border-2 border-brand-black rounded-md font-mono text-lg font-bold hover:shadow-button-hover transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </main>
  )
}

