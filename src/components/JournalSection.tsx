import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Heart, Smile, Meh, Frown, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { JournalEntry } from '../types'

export default function JournalSection() {
  const [content, setContent] = useState('')
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error && data) {
      setEntries(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    const aiInsight = "Obrigado por compartilhar. Reconhecer seus sentimentos é um ato de coragem."

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content: content.trim(),
        mood_score: moodScore,
        ai_insights: aiInsight
      })

    if (!error) {
      setContent('')
      setMoodScore(null)
      loadEntries()
    }

    setLoading(false)
  }

  const getMoodIcon = (score: number) => {
    if (score <= 2) return <Frown className="w-5 h-5 text-red-500" />
    if (score <= 3) return <Meh className="w-5 h-5 text-yellow-500" />
    return <Smile className="w-5 h-5 text-green-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Diário</h1>
      </div>
      
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Como você está se sentindo agora? 💭
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descreva seus pensamentos e sentimentos:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Não há julgamento aqui. Pode expressar tudo o que está sentindo..."
              className="w-full h-32 p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Como está seu humor agora? (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setMoodScore(score)}
                  className={`p-3 rounded-md border-2 transition-colors ${
                    moodScore === score
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {getMoodIcon(score)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Registrar'}</span>
          </button>
        </form>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Suas reflexões recentes</h3>
        
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Ainda não há registros. Que tal começar?
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {entry.mood_score && getMoodIcon(entry.mood_score)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <p className="text-foreground mb-3">{entry.content}</p>
                
                {entry.ai_insights && (
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-secondary-foreground">{entry.ai_insights}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
