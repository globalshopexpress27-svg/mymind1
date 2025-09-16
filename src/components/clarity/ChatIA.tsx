import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquare, User, Heart } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'

type Message = {
  sender: 'user' | 'ai'
  content: string
}

const getAIResponse = (message: string): string => {
  const lowerCaseMessage = message.toLowerCase();

  const procrastinationKeywords = ['procrastinando', 'sem vontade', 'sem energia', 'não consigo começar', 'paralisado'];
  if (procrastinationKeywords.some(kw => lowerCaseMessage.includes(kw))) {
    const responses = [
      "Totalmente compreensível. Vamos quebrar essa inércia com algo mínimo. Que tal apenas se levantar e esticar o corpo por 30 segundos? O que acha?",
      "Essa sensação é super comum. Vamos enganar o cérebro. Escolha UMA coisa, a mais fácil da sua lista, e faça só por 1 minuto. Qual seria essa micro-tarefa?",
      "Entendo. A energia não aparece do nada. Que tal um passo físico? Pegar um copo d'água ou abrir a janela. Qual dos dois parece mais fácil agora?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const focusKeywords = ['foco', 'distraído', 'não consigo concentrar', 'perdido nas tarefas'];
  if (focusKeywords.some(kw => lowerCaseMessage.includes(kw))) {
    const responses = [
      "Ok, o cérebro está pulando por aí. Vamos simplificar. Qual é a ÚNICA tarefa que, se feita, já faria seu dia melhor? Apenas uma.",
      "Acontece. Vamos trazer o foco para o presente. Olhe ao seu redor e me diga uma coisa que você pode arrumar em menos de 10 segundos. O que seria?",
      "É difícil focar quando tudo parece importante. Que tal escolhermos a tarefa mais rápida da sua lista, só para sentir a vitória? Qual poderia ser?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const overwhelmKeywords = ['ansioso', 'sobrecarregado', 'muita coisa', 'não sei por onde começar'];
  if (overwhelmKeywords.some(kw => lowerCaseMessage.includes(kw))) {
    const responses = [
      "Respira. Essa sensação de avalanche é real. Vamos ignorar a lista toda por um instante. Qual é a coisa mais URGENTE, se houver alguma?",
      "Ok, é muita informação. Vamos fazer um 'brain dump' rápido. Me diga 3 coisas que estão pesando mais. Só três, por enquanto.",
      "Entendo. Quando a mente está cheia, o corpo paralisa. Vamos focar no físico: que tal colocar uma música que você gosta e só ouvir por um minuto? Qual música seria?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const gratitudeKeywords = ['obrigado', 'ajudou', 'valeu', 'consegui'];
  if (gratitudeKeywords.some(kw => lowerCaseMessage.includes(kw))) {
    const responses = [
      "Que bom ouvir isso! Fico feliz em ajudar. Qual o próximo pequeno passo?",
      "Você que fez o trabalho duro! Fico feliz em ser um apoio. Como se sente agora?",
      "Excelente! Celebrar pequenas vitórias é fundamental. O que podemos fazer a seguir?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const defaultResponses = [
    "Entendido. Obrigado por compartilhar. O que está passando pela sua cabeça agora que mais te incomoda?",
    "Ok, estou aqui com você. Qual é o principal obstáculo que você está sentindo neste exato momento?",
    "Certo. Se você pudesse mudar uma coisinha no seu ambiente agora para se sentir melhor, o que seria?",
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default function ChatIA() {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', content: 'Olá! Sou seu companheiro de conversa. Como posso te ajudar a clarear as coisas hoje?' }
  ])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This could be expanded to load a list of past chats
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || !user) return

    const userMessage: Message = { sender: 'user', content: userInput }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setUserInput('')
    setIsLoading(true)

    // Simulate AI response and save
    setTimeout(async () => {
      const aiResponseContent = getAIResponse(userInput)
      const aiMessage: Message = { sender: 'ai', content: aiResponseContent }
      const finalMessages = [...newMessages, aiMessage]
      setMessages(finalMessages)
      setIsLoading(false)

      if (conversationId) {
        // Update existing conversation
        await supabase.from('ai_conversations').update({ messages: finalMessages, updated_at: new Date().toISOString() }).eq('id', conversationId)
      } else {
        // Create new conversation
        const { data } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            title: userInput.substring(0, 40),
            messages: finalMessages,
          })
          .select('id')
          .single()
        if (data) {
          setConversationId(data.id)
        }
      }
    }, 1200)
  }

  return (
    <div className="p-4 space-y-4 h-[75vh] flex flex-col">
      <div className="text-center">
        <MessageSquare className="mx-auto w-10 h-10 text-primary" />
        <h3 className="text-lg font-semibold text-foreground mt-2">Chat com IA</h3>
        <p className="text-muted-foreground text-sm">Seu espaço seguro para organizar pensamentos e encontrar foco.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx('flex items-end gap-2', {
              'justify-end': msg.sender === 'user',
              'justify-start': msg.sender === 'ai',
            })}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={clsx('max-w-md p-3 rounded-2xl', {
                'bg-primary text-primary-foreground rounded-br-lg': msg.sender === 'user',
                'bg-secondary text-secondary-foreground rounded-bl-lg': msg.sender === 'ai',
              })}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
             {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <div className="max-w-md p-3 rounded-2xl bg-secondary">
              <div className="flex gap-1.5 items-center">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-border">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
