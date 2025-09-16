import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Brain, ListTodo, AlertTriangle, Lightbulb } from 'lucide-react'

// This component is a sub-component of ClaritySection and does not need a full redesign, just color/style adjustments.
// The logic remains the same.

export default function BrainDump() {
  const [dump, setDump] = useState('')
  const [organized, setOrganized] = useState<{ tasks: string[]; worries: string[]; ideas: string[] } | null>(null)
  const [isOrganizing, setIsOrganizing] = useState(false)

  const handleOrganize = () => {
    setIsOrganizing(true)
    const lines = dump.split('\n').filter(line => line.trim() !== '')
    const tasks: string[] = [], worries: string[] = [], ideas: string[] = []
    const taskKeywords = ['fazer', 'comprar', 'resolver', 'enviar', 'ligar']
    const worryKeywords = ['preocupado', 'e se', 'medo', 'ansioso']
    const ideaKeywords = ['ideia', 'que tal', 'poderia', 'imagina']

    lines.forEach(line => {
      const lowerLine = line.toLowerCase()
      if (taskKeywords.some(kw => lowerLine.includes(kw))) tasks.push(line)
      else if (worryKeywords.some(kw => lowerLine.includes(kw))) worries.push(line)
      else if (ideaKeywords.some(kw => lowerLine.includes(kw))) ideas.push(line)
      else tasks.push(line)
    })

    setTimeout(() => {
      setOrganized({ tasks, worries, ideas })
      setIsOrganizing(false)
    }, 1000)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <Edit className="mx-auto w-10 h-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground mt-2">Organizador de Pensamentos</h3>
        <p className="text-muted-foreground text-sm">Tire tudo da cabeça. Nós ajudamos a organizar.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={dump}
          onChange={(e) => setDump(e.target.value)}
          placeholder="Tarefas, preocupações, ideias... Apenas escreva."
          className="w-full h-40 p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring resize-y"
        />
        <button onClick={handleOrganize} disabled={!dump.trim() || isOrganizing} className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50">
          {isOrganizing ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Brain className="w-5 h-5" /></motion.div><span>Organizando...</span></> : <><Brain className="w-5 h-5" /><span>Organizar</span></>}
        </button>
      </div>

      {organized && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h4 className="text-md font-semibold text-center text-foreground">Seus pensamentos, organizados:</h4>
          {organized.tasks.length > 0 && <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"><h5 className="font-semibold text-green-800 flex items-center gap-2 mb-2"><ListTodo /><span>Tarefas</span></h5><ul className="list-disc list-inside space-y-1 text-sm text-green-700">{organized.tasks.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {organized.worries.length > 0 && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><h5 className="font-semibold text-red-800 flex items-center gap-2 mb-2"><AlertTriangle /><span>Preocupações</span></h5><ul className="list-disc list-inside space-y-1 text-sm text-red-700">{organized.worries.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {organized.ideas.length > 0 && <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"><h5 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2"><Lightbulb /><span>Ideias</span></h5><ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">{organized.ideas.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
        </motion.div>
      )}
    </div>
  )
}
