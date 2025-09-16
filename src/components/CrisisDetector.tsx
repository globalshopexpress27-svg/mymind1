import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Phone, MessageSquare, Heart, ExternalLink } from 'lucide-react'

interface CrisisDetectorProps {
  journalContent?: string
  moodScore?: number
}

export default function CrisisDetector({ journalContent, moodScore }: CrisisDetectorProps) {
  const [isCrisis, setIsCrisis] = useState(false)

  useEffect(() => {
    const criticalWords = ['suicidio', 'me matar', 'acabar com tudo', 'quero morrer', 'sem saída', 'sem esperança']
    const content = journalContent?.toLowerCase() || ''
    const highRisk = criticalWords.some(word => content.includes(word)) || (moodScore !== undefined && moodScore === 1)
    setIsCrisis(highRisk)
  }, [journalContent, moodScore])

  if (!isCrisis) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <Heart className="w-8 h-8 mx-auto text-green-500 mb-2" />
        <p className="text-muted-foreground">Nenhum sinal de crise detectado. Continue se cuidando!</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-2 rounded-xl p-6 border-destructive bg-destructive/10 text-destructive-foreground"
    >
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1 text-destructive" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-3">Sistema de Apoio Ativado</h3>
          <p className="mb-4 leading-relaxed text-destructive">
            Percebo sinais que me preocupam. Sua vida tem valor. Por favor, entre em contato com apoio profissional.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold">Recursos de Apoio Imediato:</h4>
            <a href="https://cvv.org.br" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-card p-3 rounded-md border border-border hover:bg-secondary">
              <div>
                <h5 className="font-medium">CVV - Centro de Valorização da Vida</h5>
                <p className="text-sm text-muted-foreground">Ligue 188 ou acesse o chat online.</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            <div className="bg-card p-3 rounded-md border border-border">
              <h5 className="font-medium">SAMU - Emergência Médica</h5>
              <p className="text-sm text-muted-foreground">Em caso de emergência, ligue 192.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
