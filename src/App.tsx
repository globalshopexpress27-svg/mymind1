import React from 'react'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import { Heart } from 'lucide-react'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-muted-foreground">Carregando seu espaço seguro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/50">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  )
}

export default App
