import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import {
  Send, Bot, User, Trash2, ArrowLeft,
  IndianRupee, Loader2
} from 'lucide-react'

const SUGGESTED = [
  "Where am I overspending this month?",
  "How can I save ₹10,000 next month?",
  "What subscriptions should I cancel?",
  "Am I following the 50/30/20 rule?",
  "What's my biggest spending category?",
  "How do I build an emergency fund?",
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-violet-600' : 'bg-white/10'}`}>
        {isUser
          ? <User size={16} className="text-white" />
          : <Bot size={16} className="text-violet-400" />}
      </div>
      {/* Bubble */}
      <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
        ? 'bg-violet-600 text-white rounded-tr-sm'
        : 'bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm'}`}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-violet-400" />
      </div>
      <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [streaming, setStreaming] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history')
      setMessages(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setHistoryLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      await api.delete('/chat/history')
      setMessages([])
    } catch (e) {
      console.error(e)
    }
  }

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setLoading(true)
    setStreaming('')

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://ai-finance-coach-production.up.railway.app'
      const response = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setMessages(prev => [...prev, { role: 'assistant', content: fullText }])
              setStreaming('')
              break
            }
            try {
              const parsed = JSON.parse(data)
              fullText += parsed.content
              setStreaming(fullText)
            } catch { }
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
      setStreaming('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/6"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-4">
          <Link to="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <IndianRupee size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">AI Finance Coach</span>
          </div>
        </div>
        <button onClick={clearHistory}
          className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 transition">
          <Trash2 size={15} /> Clear chat
        </button>
      </nav>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {historyLoading ? (
            <div className="flex justify-center pt-20">
              <Loader2 size={24} className="text-violet-400 animate-spin" />
            </div>
          ) : messages.length === 0 && !streaming ? (

            /* Empty state */
            <div className="text-center pt-12">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                <Bot size={32} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your AI Finance Coach</h2>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">
                I've analyzed your spending. Ask me anything about your finances — I'll give you specific advice based on your real numbers.
              </p>

              {/* Suggested questions */}
              <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-left px-4 py-3 rounded-xl border border-white/8 hover:border-violet-500/40 bg-white/2 hover:bg-violet-500/5 text-sm text-gray-400 hover:text-gray-200 transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            <>
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}

              {/* Streaming message */}
              {streaming && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-violet-400" />
                  </div>
                  <div className="max-w-xl px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white/5 border border-white/8 text-gray-200">
                    {streaming}
                    <span className="inline-block w-1 h-4 bg-violet-400 ml-1 animate-pulse rounded-sm" />
                  </div>
                </div>
              )}

              {/* Typing indicator — before streaming starts */}
              {loading && !streaming && <TypingIndicator />}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/6 px-4 py-4"
        style={{ background: 'rgba(10,10,15,0.95)' }}>
        <div className="max-w-2xl mx-auto">

          {/* Suggested chips — show after conversation starts */}
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTED.slice(0, 3).map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-violet-500/40 text-gray-400 hover:text-gray-200 bg-white/2 hover:bg-violet-500/5 transition">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input box */}
          <div className="flex items-end gap-3 bg-white/5 border border-white/10 hover:border-violet-500/30 focus-within:border-violet-500/50 rounded-2xl px-4 py-3 transition">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your finances..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-gray-600 resize-none text-sm focus:outline-none leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition">
              <Send size={15} className="text-white" />
            </button>
          </div>

          <p className="text-center text-xs text-gray-700 mt-3">
            Advice is based on your uploaded bank statement + financial best practices
          </p>
        </div>
      </div>
    </div>
  )
}