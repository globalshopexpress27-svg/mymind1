import React from 'react'
import { Shield } from 'lucide-react'
import CrisisDetector from './CrisisDetector'

export default function SafeNetSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-destructive" />
        <h1 className="text-3xl font-bold text-foreground">Rede de Apoio</h1>
      </div>
      <p className="text-muted-foreground">
        Recursos e ferramentas para momentos de crise. Você não está sozinho(a).
      </p>

      <CrisisDetector journalContent="Estou me sentindo sem esperança" moodScore={1} />
    </div>
  )
}
