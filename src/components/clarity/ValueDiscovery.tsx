import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Heart, Award } from 'lucide-react'

// This component is a sub-component of ClaritySection and does not need a full redesign, just color/style adjustments.
// The logic remains the same.

const valuePairs = [
  { a: 'Segurança', b: 'Aventura' }, { a: 'Criatividade', b: 'Ordem' }, { a: 'Comunidade', b: 'Independência' },
  { a: 'Conhecimento', b: 'Ação' }, { a: 'Crescimento', b: 'Estabilidade' }, { a: 'Impacto Social', b: 'Sucesso Pessoal' },
]

export default function ValueDiscovery() {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)

  const handleSelect = (value: string) => {
    setSelections(prev => ({ ...prev, [value]: (prev[value] || 0) + 1 }))
    if (step < valuePairs.length - 1) setStep(step + 1)
    else setShowResults(true)
  }

  if (showResults) {
    const topValues = Object.entries(selections).sort(([, a], [, b]) => b - a).slice(0, 3).map(([value]) => value)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6 text-center">
        <Award className="mx-auto w-10 h-10 text-yellow-500" />
        <h3 className="text-lg font-semibold text-foreground mt-2">Seus Valores Principais</h3>
        <p className="text-muted-foreground">Use-os como uma bússola para guiar suas decisões.</p>
        <div className="space-y-4 text-left">
          {topValues.map((value, i) => (
            <motion.div key={value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary flex items-center gap-2"><Heart className="w-5 h-5" /><span>{value}</span></h4>
            </motion.div>
          ))}
        </div>
        <button onClick={() => { setStep(0); setSelections({}); setShowResults(false) }} className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">Refazer</button>
      </motion.div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <Search className="mx-auto w-10 h-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground mt-2">Descoberta de Valores</h3>
        <p className="text-muted-foreground text-sm">O que é mais importante para você?</p>
      </div>
      <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((step + 1) / valuePairs.length) * 100}%` }}></div></div>
      <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <p className="font-medium text-foreground">Qual destes você valoriza mais?</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => handleSelect(valuePairs[step].a)} className="flex-1 p-6 border-2 border-border rounded-lg hover:bg-secondary hover:border-primary transition-colors"><span className="text-lg font-semibold text-foreground">{valuePairs[step].a}</span></button>
          <div className="flex items-center justify-center text-muted-foreground font-medium">OU</div>
          <button onClick={() => handleSelect(valuePairs[step].b)} className="flex-1 p-6 border-2 border-border rounded-lg hover:bg-secondary hover:border-primary transition-colors"><span className="text-lg font-semibold text-foreground">{valuePairs[step].b}</span></button>
        </div>
      </motion.div>
    </div>
  )
}
