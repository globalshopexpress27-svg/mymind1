import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Lightbulb, Send } from 'lucide-react'

// This component is a sub-component of ClaritySection and does not need a full redesign, just color/style adjustments.
// The logic remains the same.

export default function GuidedReflection() {
  // State and logic remains the same
  const [step, setStep] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [insights, setInsights] = useState<string[]>([])

  const reflectionPath = [
    { question: "O que está mais pesado na sua mente agora?", placeholder: "Ex: Não consigo começar a trabalhar...", analysis: (answer: string) => `Obrigado por compartilhar sobre "${answer}". Reconhecer o peso já é um passo.` },
    { question: "Como está seu nível de energia, de 0 a 10?", placeholder: "Apenas um número...", analysis: (answer: string) => `Nível de energia ${answer}, anotado. Isso nos dá um contexto importante.` },
    { question: "Qual é a emoção principal que você está sentindo?", placeholder: "Ex: ansiedade, tristeza, frustração...", analysis: (answer: string) => `Nomear a emoção "${answer}" é uma ferramenta poderosa. Você está no caminho certo.` },
    { question: "Qual pensamento autocrítico está passando pela sua cabeça?", placeholder: "Ex: 'Eu sou um fracasso'...", analysis: (answer: string) => `Identificar o pensamento "${answer}" ajuda a separá-lo da sua identidade. Lembre-se: você não é seus pensamentos.` },
  ]

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentAnswer.trim()) return;
    const currentStep = reflectionPath[step]
    const insight = currentStep.analysis(currentAnswer)
    setInsights([...insights, insight])
    setCurrentAnswer('')
    if (step < reflectionPath.length - 1) {
      setStep(step + 1)
    } else {
      setStep(step + 1) // Go to final screen
    }
  }

  const handleRestart = () => {
    setStep(0); setInsights([]); setCurrentAnswer('');
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <BrainCircuit className="mx-auto w-10 h-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground mt-2">Reflexão Guiada</h3>
        <p className="text-muted-foreground text-sm">Vamos entender juntos a raiz das suas dificuldades.</p>
      </div>

      {step < reflectionPath.length ? (
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {insights.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary/90">{insights[insights.length - 1]}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleNextStep} className="space-y-4">
            <label className="block font-medium text-foreground">{reflectionPath[step].question}</label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={reflectionPath[step].placeholder}
              className="w-full h-24 p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring resize-none"
              required
            />
            <button type="submit" className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90">
              <Send className="w-4 h-4" />
              <span>Próximo</span>
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800">Reflexão Concluída!</h4>
          <p className="text-green-700">Ótimo trabalho! Entender a causa da dificuldade é o primeiro passo para superá-la.</p>
          <button onClick={handleRestart} className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
            Começar Novamente
          </button>
        </motion.div>
      )}
    </div>
  )
}
