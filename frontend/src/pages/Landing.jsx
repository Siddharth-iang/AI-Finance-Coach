import { Link } from 'react-router-dom'
import {
  TrendingUp, Shield, MessageCircle, Upload,
  PieChart, Zap, Star, ArrowRight, CheckCircle, IndianRupee
} from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <IndianRupee size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">FinCoach <span className="text-violet-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition">How it works</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#testimonials" className="hover:text-white transition">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition">
            Login
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 px-5 py-2 rounded-lg transition flex items-center gap-2">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">

        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Zap size={12} className="text-violet-400" />
            Powered by RAG + Groq LLM — answers in under 2 seconds
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Stop guessing<br />
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                where your money goes
              </span>
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your bank statement. Get an instant spending breakdown.
            Then chat with an AI that actually knows your finances —
            <span className="text-gray-200"> not some generic advice bot.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25">
              Analyze my spending free
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works"
              className="w-full sm:w-auto border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition text-lg text-center">
              See how it works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
              <span className="ml-1 text-gray-400">4.9/5 from 200+ users</span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-gray-700" />
            <span className="text-gray-400">🇮🇳 Built for Indian bank statements</span>
            <span className="hidden sm:block w-px h-4 bg-gray-700" />
            <span className="text-gray-400">No credit card required</span>
          </div>
        </div>

        {/* Hero image / dashboard mockup */}
        <div className="relative z-10 mt-20 max-w-5xl mx-auto w-full">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-gray-600">fincoach.ai/dashboard</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
              alt="Dashboard preview"
              className="w-full object-cover opacity-60"
              style={{ maxHeight: '400px', objectPosition: 'top' }}
            />
            {/* Overlay cards on image */}
            <div className="absolute bottom-6 left-6 bg-[#13131A] border border-white/10 rounded-xl p-4 shadow-xl">
              <p className="text-xs text-gray-500 mb-1">This month's savings</p>
              <p className="text-2xl font-bold text-green-400">₹12,400</p>
              <p className="text-xs text-green-500 mt-1">↑ 23% vs last month</p>
            </div>
            <div className="absolute bottom-6 right-6 bg-[#13131A] border border-white/10 rounded-xl p-4 shadow-xl max-w-xs">
              <p className="text-xs text-gray-500 mb-2">AI Coach says</p>
              <p className="text-sm text-gray-200">"You spent ₹6,200 on food delivery this month — that's 34% over your usual. Want a plan to cut it?"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 border-y border-white/5"
        style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Active users" },
            { number: "₹2.4Cr", label: "Spending analyzed" },
            { number: "91%", label: "Helpfulness rate" },
            { number: "<2s", label: "AI response time" },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{stat.number}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-bold text-white">From zero to financial clarity<br />in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: <Upload size={24} className="text-violet-400" />,
                title: "Upload your statement",
                desc: "Drop your bank CSV — HDFC, SBI, ICICI, Axis all supported. We parse it instantly, no manual entry.",
                img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
              },
              {
                step: "02",
                icon: <PieChart size={24} className="text-fuchsia-400" />,
                title: "See your dashboard",
                desc: "Every rupee categorized. Charts showing where you actually spend — not where you think you spend.",
                img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&q=80"
              },
              {
                step: "03",
                icon: <MessageCircle size={24} className="text-indigo-400" />,
                title: "Chat with your AI coach",
                desc: "Ask anything in plain language. Get answers that reference your real numbers — not generic advice.",
                img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80"
              },
            ].map((item) => (
              <div key={item.step}
                className="group rounded-2xl border border-white/8 overflow-hidden hover:border-violet-500/30 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="h-40 overflow-hidden">
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl font-black text-white/5">{item.step}</span>
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6"
        style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-bold">Everything your bank app<br />should have but doesn't</h2>
          </div>

          {/* Big feature */}
          <div className="rounded-2xl border border-white/8 overflow-hidden mb-6"
            style={{ background: 'rgba(124,58,237,0.05)' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <MessageCircle size={24} className="text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">RAG-powered AI that knows your finances</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Most AI chatbots give the same advice to everyone. Ours retrieves real financial frameworks — 50/30/20 rule, emergency fund guidelines, debt strategies — and combines them with <span className="text-white">your actual transaction data</span> to give advice that's specific to you.
                </p>
                <div className="space-y-2">
                  {["References your real spending numbers", "Grounded in proven financial frameworks", "Remembers your conversation context"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle size={16} className="text-violet-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
                  alt="AI Chat"
                  className="w-full h-full object-cover opacity-30"
                />
                {/* Chat bubble mockup */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 gap-3">
                  <div className="self-end bg-violet-600/80 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs text-sm">
                    Where am I overspending this month?
                  </div>
                  <div className="self-start bg-white/10 backdrop-blur rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs text-sm text-gray-200">
                    You've spent ₹8,400 on food delivery — 28% above your average. Cutting to 3 orders/week saves ₹3,200 monthly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small features grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <PieChart size={20} className="text-fuchsia-400" />, title: "Visual spending breakdown", desc: "Pie charts, bar graphs, daily patterns. See your money visually, not in a boring table." },
              { icon: <Shield size={20} className="text-green-400" />, title: "Private & secure", desc: "JWT auth, bcrypt passwords. Your financial data never leaves our encrypted servers." },
              { icon: <Zap size={20} className="text-yellow-400" />, title: "Instant categorization", desc: "Swiggy, Uber, Netflix auto-detected. 10 categories, zero manual tagging required." },
              { icon: <TrendingUp size={20} className="text-blue-400" />, title: "Monthly trends", desc: "See if you're spending more or less over time. Spot the months you went overboard." },
              { icon: <MessageCircle size={20} className="text-violet-400" />, title: "Hinglish support", desc: "Ask in Hindi, English, or Hinglish. We understand how Indians actually talk about money." },
              { icon: <IndianRupee size={20} className="text-orange-400" />, title: "Built for India", desc: "HDFC, SBI, ICICI, Axis formats all supported. UPI transactions properly recognized." },
            ].map(f => (
              <div key={f.title}
                className="p-6 rounded-2xl border border-white/6 hover:border-white/12 transition"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-violet-500/20 p-16 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #7c3aed, transparent 60%)' }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to actually understand<br />your money?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Takes 2 minutes. No credit card. Just upload your CSV and go.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-10 py-4 rounded-xl transition text-lg shadow-lg shadow-violet-500/25">
              Start for free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <IndianRupee size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-400">FinCoach AI</span>
          </div>
          <p className="text-gray-600 text-sm">Built with ❤️ for Indians who want to actually save money</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}