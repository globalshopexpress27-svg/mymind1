import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Trophy, Star, Calendar, Heart } from 'lucide-react'

const stats = {
  completionRate: 60,
  effortPoints: 1250,
  currentStreak: 7,
  journalEntries: 15
}

const achievements = [
  { name: 'Primeira Reflexão', unlocked: true },
  { name: 'Primeira Tarefa', unlocked: true },
  { name: 'Constância', unlocked: true },
  { name: 'Esforço Reconhecido', unlocked: false },
]

export default function ProgressSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Seu Progresso</h1>
      </div>
      <p className="text-muted-foreground">
        Celebre sua jornada, não apenas o destino. Cada passo é uma vitória.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'Taxa de Conclusão', value: `${stats.completionRate}%` },
          { icon: Star, label: 'Pontos de Esforço', value: stats.effortPoints },
          { icon: Calendar, label: 'Sequência Atual', value: `${stats.currentStreak} dias` },
          { icon: Heart, label: 'Reflexões', value: stats.journalEntries },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Suas Conquistas</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach, i) => (
            <div key={i} className={`p-4 rounded-lg border-2 ${ach.unlocked ? 'border-green-500/30 bg-green-500/10' : 'border-border bg-secondary'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ach.unlocked ? 'bg-green-500' : 'bg-muted'}`}>
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`font-medium ${ach.unlocked ? 'text-green-800' : 'text-muted-foreground'}`}>{ach.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
