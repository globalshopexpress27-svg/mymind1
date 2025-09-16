import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Heart, Lightbulb } from 'lucide-react'

export default function EmpatheticAI() {
  const responses = [
    { message: "Você está aqui, tentando. Isso já é uma vitória.", suggestion: "Celebre cada pequeno esforço hoje." },
    { message: "Seus sentimentos são válidos, mesmo que sejam difíceis.", suggestion: "Respire fundo. Você está seguro(a) aqui." },
    { message: "Progresso não é linear. Está tudo bem não estar bem.", suggestion: "Que tal fazer uma pequena pausa e fazer algo que você gosta?" },
  ]
  const response = responses[Math.floor(Math.random() * responses.length)]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-6 bg-primary/10 border-primary/20"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-card">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-primary uppercase tracking-wider">IA Empática</span>
          </div>
          <p className="font-medium mb-3 leading-relaxed text-primary/90">
            {response.message}
          </p>
          <div className="bg-card/70 rounded-lg p-3 border border-card/50">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <p className="text-sm text-primary/80">
                <strong>Sugestão:</strong> {response.suggestion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
