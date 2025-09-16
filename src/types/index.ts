export interface User {
  id: string
  email: string
  full_name?: string
}

export interface JournalEntry {
  id: string
  user_id: string
  content: string
  mood_score?: number
  ai_insights?: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  effort_score?: number
  created_at: string
  completed_at?: string
}

export interface Profile {
  id: string
  user_id: string
  full_name?: string
  created_at: string
  updated_at: string
}

export type Section = 'inicio' | 'diario' | 'tarefas' | 'metas' | 'clareza' | 'progresso' | 'apoio'
