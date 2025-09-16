import React from 'react'
import { motion } from 'framer-motion'
import { Tab } from '@headlessui/react'
import { Sparkles, BrainCircuit, Edit, Search, MessageSquare } from 'lucide-react'
import GuidedReflection from './clarity/GuidedReflection'
import BrainDump from './clarity/BrainDump'
import ValueDiscovery from './clarity/ValueDiscovery'
import ChatIA from './clarity/ChatIA'

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ClaritySection() {
  const tabs = [
    { name: 'Chat com IA', icon: MessageSquare, component: <ChatIA /> },
    { name: 'Reflexão Guiada', icon: BrainCircuit, component: <GuidedReflection /> },
    { name: 'Organizador de Pensamentos', icon: Edit, component: <BrainDump /> },
    { name: 'Descoberta de Valores', icon: Search, component: <ValueDiscovery /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Clareza Mental</h1>
      </div>
      <p className="text-muted-foreground">
        Ferramentas para transformar o caos mental em autoconhecimento e direção. 
        Vamos entender juntos o que está acontecendo por dentro.
      </p>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-secondary p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary/50 ring-white ring-opacity-60',
                  selected
                    ? 'bg-card text-primary shadow'
                    : 'text-muted-foreground hover:bg-card/70'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-card border border-border p-0', // Changed padding to 0
                'focus:outline-none'
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {tab.component}
              </motion.div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
