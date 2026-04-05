// Make sure to remove the reviews option

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  TrendingUp, TrendingDown, Upload, MessageCircle,
  LogOut, IndianRupee, PieChart as PieIcon,
  BarChart2, List, Wallet
} from 'lucide-react'

const COLORS = ['#7c3aed', '#6366f1', '#a78bfa', '#c4b5fd', '#818cf8', '#f472b6', '#fb923c', '#34d399', '#38bdf8', '#facc15']

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl border border-white/8 p-6"
      style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4`}
        style={{ background: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [charts, setCharts] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [s, c] = await Promise.all([
        api.get('/transactions/summary'),
        api.get('/transactions/charts')
      ])
      setSummary(s.data)
      setCharts(c.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadMsg('')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await api.post('/transactions/upload', form)
      setUploadMsg(res.data.message)
      await fetchData()
    } catch {
      setUploadMsg('Upload failed. Check your CSV format.')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const categoryData = summary?.by_category
    ? Object.entries(summary.by_category).map(([name, value]) => ({ name, value: Math.round(value) }))
    : []

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/6"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <IndianRupee size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold">FinCoach <span className="text-violet-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/chat"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <MessageCircle size={16} /> Chat with AI
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-white/5 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header + Upload */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
            <p className="text-gray-500 mt-1">Here's where your money is going</p>
          </div>
          <div className="flex items-center gap-3">
            {uploadMsg && (
              <span className={`text-sm px-3 py-1 rounded-lg ${uploadMsg.includes('failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {uploadMsg}
              </span>
            )}
            <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition">
              <Upload size={16} className="text-violet-400" />
              {uploading ? 'Uploading...' : 'Upload CSV'}
              <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !summary || summary.message === 'No transactions found' ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
              <Upload size={36} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Upload your bank statement</h2>
            <p className="text-gray-500 max-w-md mb-8">Upload a CSV from HDFC, SBI, ICICI or any Indian bank. We'll categorize every transaction and show you exactly where your money goes.</p>
            <label className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer transition">
              <Upload size={18} /> Choose CSV file
              <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
            </label>
          </div>

        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<TrendingUp size={20} />}
                label="Total Income"
                value={`₹${summary.total_income?.toLocaleString('en-IN')}`}
                sub="This period"
                color="#34d399"
              />
              <StatCard
                icon={<TrendingDown size={20} />}
                label="Total Spent"
                value={`₹${summary.total_spent?.toLocaleString('en-IN')}`}
                sub="This period"
                color="#f87171"
              />
              <StatCard
                icon={<Wallet size={20} />}
                label="Savings Rate"
                value={`${summary.savings_rate}%`}
                sub={summary.savings_rate >= 20 ? "Great job! 🎉" : "Target: 20%"}
                color="#a78bfa"
              />
              <StatCard
                icon={<IndianRupee size={20} />}
                label="Net Savings"
                value={`₹${(summary.total_income - summary.total_spent)?.toLocaleString('en-IN')}`}
                sub="Income - Spent"
                color="#38bdf8"
              />
            </div>

            {/* Charts row 1 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Pie chart */}
              <div className="rounded-2xl border border-white/8 p-6"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <PieIcon size={18} className="text-violet-400" />
                  <h3 className="font-bold text-white">Spending by Category</h3>
                </div>
                {categoryData.length > 0 ? (
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                          {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                          formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 min-w-0">
                      {categoryData.slice(0, 6).map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-gray-400 truncate">{item.name}</span>
                          <span className="text-white font-medium ml-auto">₹{item.value.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-gray-500 text-sm">No spending data</p>}
              </div>

              {/* Bar chart */}
              <div className="rounded-2xl border border-white/8 p-6"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 size={18} className="text-fuchsia-400" />
                  <h3 className="font-bold text-white">Monthly Spending Trend</h3>
                </div>
                {charts?.monthly?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={charts.monthly}>
                      <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
                      />
                      <Bar dataKey="spent" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-gray-500 text-sm">No monthly data</p>}
              </div>
            </div>

            {/* Charts row 2 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Line chart */}
              <div className="rounded-2xl border border-white/8 p-6"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-green-400" />
                  <h3 className="font-bold text-white">Daily Spending Pattern</h3>
                </div>
                {charts?.daily?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={charts.daily}>
                      <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
                      />
                      <Line type="monotone" dataKey="spent" stroke="#34d399" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <p className="text-gray-500 text-sm">No daily data</p>}
              </div>

              {/* Top transactions */}
              <div className="rounded-2xl border border-white/8 p-6"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <List size={18} className="text-orange-400" />
                  <h3 className="font-bold text-white">Top Transactions</h3>
                </div>
                {charts?.top_transactions?.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto max-h-52">
                    {charts.top_transactions.map((t, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{t.description}</p>
                          <p className="text-xs text-gray-500">{t.date} · {t.category}</p>
                        </div>
                        <span className="text-red-400 font-semibold text-sm shrink-0">
                          -₹{t.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">No transactions</p>}
              </div>
            </div>

            {/* AI Coach CTA */}
            <div className="rounded-2xl border border-violet-500/20 p-8 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.05))' }}>
              <h3 className="text-xl font-bold text-white mb-2">Want to know what to do next?</h3>
              <p className="text-gray-400 mb-6">Your AI coach has seen your spending. Ask it anything — where to cut, how to save, what your biggest problems are.</p>
              <Link to="/chat"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition">
                <MessageCircle size={18} /> Chat with your AI Coach
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
