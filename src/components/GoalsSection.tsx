import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Zap, Battery, Smile, Meh, Frown, Award, Clock } from 'lucide-react'

// Combines AdaptiveGoals and EffortTracking

export default function GoalsSection() {
  const [energyLevel, setEnergyLevel] = useState(3)
  const [moodScore, setMoodScore] = useState(3)

  const getAdaptationMessage = () => {
    if (moodScore <= 2) return "Hoje está difícil. Metas adaptadas para focar no essencial. 💙"
    if (energyLevel <= 2) return "Energia baixa. Metas ajustadas para serem mais gentis. 🌱"
    if (energyLevel >= 4) return "Boa energia hoje! Você consegue! ⚡"
    return "Metas ajustadas para equilibrar desafio e gentileza. 🎯"
  }

  const adaptedGoals = [
    "Tomar um copo d'água",
    "Fazer 5 minutos de alongamento",
    "Responder UM email",
    "Arrumar a cama",
    "Ser gentil consigo mesmo(a)",
  ].slice(0, 6 - energyLevel)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Metas e Esforço</h1>
      </div>
      <p className="text-muted-foreground">
        Ajuste suas metas ao seu estado atual e reconheça cada esforço.
      </p>

      {/* Adaptive Goals */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Metas Adaptativas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              Nível de Energia
            </label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button key={level} onClick={() => setEnergyLevel(level)} className={`w-8 h-8 rounded-full border-2 transition-colors ${energyLevel === level ? 'border-primary bg-primary/10' : 'border-border'}`}>{level}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              Humor Atual
            </label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button key={score} onClick={() => setMoodScore(score)} className={`p-2 rounded-md border-2 transition-colors ${moodScore === score ? 'border-primary bg-primary/10' : 'border-border'}`}>
                  {score <= 2 ? <Frown/> : score <= 3 ? <Meh/> : <Smile/>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <motion.div key={`${moodScore}-${energyLevel}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-primary text-sm font-medium">🤖 {getAdaptationMessage()}</p>
        </motion.div>
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Suas metas para hoje:</h4>
          {adaptedGoals.map((goal, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-foreground">{goal}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Effort Tracking */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Acompanhamento de Esforço</h3>
        <p className="text-sm text-muted-foreground">Reconheça seu esforço, não apenas o resultado. Cada tentativa conta.</p>
        <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90">
          Registrar Novo Esforço
        </button>
      </div>
    </div>
  )
}
