import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, Star, Clock, CheckSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Task } from '../types'

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) loadTasks()
  }, [user])

  const loadTasks = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error && data) setTasks(data)
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newTask.trim()) return
    setLoading(true)
    const { error } = await supabase
      .from('tasks')
      .insert({ user_id: user.id, title: newTask.trim(), completed: false })
    if (!error) {
      setNewTask('')
      loadTasks()
    }
    setLoading(false)
  }

  const toggleTask = async (task: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed, completed_at: !task.completed ? new Date().toISOString() : null })
      .eq('id', task.id)
    if (!error) loadTasks()
  }

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Adicionar nova tarefa</h3>
        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="O que você gostaria de fazer?"
            className="flex-grow p-2.5 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring"
            required
          />
          <button
            type="submit"
            disabled={loading || !newTask.trim()}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pendentes</h3>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhuma tarefa pendente! Descanse. 🌟</p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary"
              >
                <button
                  onClick={() => toggleTask(task)}
                  className="w-6 h-6 border-2 border-border rounded-full flex items-center justify-center hover:border-primary"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Criada em {new Date(task.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Concluídas 🎉</h3>
          <div className="space-y-3">
            {completedTasks.slice(0, 5).map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground line-through">{task.title}</h4>
                   <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    {task.completed_at && <span>Concluída em {new Date(task.completed_at).toLocaleDateString('pt-BR')}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
