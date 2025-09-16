import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Sidebar from './Sidebar'
import JournalSection from './JournalSection'
import TasksSection from './TasksSection'
import ClaritySection from './ClaritySection'
import GoalsSection from './GoalsSection'
import ProgressSection from './ProgressSection'
import SafeNetSection from './SafeNetSection'
import EmpatheticAI from './EmpatheticAI'
import type { Section } from '../types'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('inicio')
  const { profile } = useAuth()

  const renderContent = () => {
    switch (activeSection) {
      case 'diario':
        return <JournalSection />
      case 'tarefas':
        return <TasksSection />
      case 'metas':
        return <GoalsSection />
      case 'clareza':
        return <ClaritySection />
      case 'progresso':
        return <ProgressSection />
      case 'apoio':
        return <SafeNetSection />
      case 'inicio':
      default:
        return <OverviewSection name={profile?.full_name || 'pessoa incrível'} />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  )
}

function OverviewSection({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Olá, {name}! 💙
        </h1>
        <p className="text-muted-foreground">
          Como você está se sentindo hoje? Lembre-se: cada pequeno passo é uma vitória.
        </p>
      </div>

      <EmpatheticAI />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">Progresso de Hoje</h3>
          <p className="text-3xl font-bold text-primary">3/5</p>
          <p className="text-sm text-muted-foreground">tarefas concluídas</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">Esforço Investido</h3>
          <p className="text-3xl font-bold text-primary">85%</p>
          <p className="text-sm text-muted-foreground">energia aplicada</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">Dias Consecutivos</h3>
          <p className="text-3xl font-bold text-primary">7</p>
          <p className="text-sm text-muted-foreground">de autocuidado</p>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-primary">
        <h3 className="text-lg font-semibold mb-2">💡 Dica do Dia</h3>
        <p>
          Quando sentir que não consegue começar, tente a regra dos 2 minutos: 
          comprometa-se com apenas 2 minutos da tarefa. Geralmente isso é suficiente para quebrar a inércia.
        </p>
      </div>
    </div>
  )
}
