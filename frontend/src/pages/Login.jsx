import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { IndianRupee, ArrowLeft } from 'lucide-react'
import Spinner from '../components/Spinner'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Error handling and loader set
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4">

      {/* Back link */}
      <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-10 transition">
        <ArrowLeft size={14} /> Back to home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <IndianRupee size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">FinCoach <span className="text-violet-400">AI</span></span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 p-8"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Login to see your financial dashboard</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Spinner size={18} /> Logging in...</> : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          No account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
