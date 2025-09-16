/*
# My Mind - AI Chat Schema Migration

Esta migração adiciona a funcionalidade de chat com IA, permitindo que os usuários
tenham conversas de apoio para gerenciar o TDAH e outras dificuldades.

## Query Description:
Esta operação cria uma nova tabela `ai_conversations` para armazenar o histórico
das conversas entre o usuário e a IA. A tabela `messages` usará o tipo JSONB
para guardar de forma eficiente a troca de mensagens. Também inclui as políticas
de segurança (RLS) para garantir que cada usuário só possa acessar suas próprias
conversas.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- ai_conversations: Armazena o histórico de conversas com a IA.
  - user_id: Chave estrangeira para o usuário.
  - messages: Campo JSONB para a lista de mensagens.
  - title: Título da conversa para fácil identificação.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Os usuários só podem ler e escrever em suas próprias conversas.

## Performance Impact:
- Indexes: Adicionados em `user_id` para buscas rápidas.
- Triggers: Nenhum.
- Estimated Impact: Baixo.
*/

-- Create ai_conversations table
CREATE TABLE public.ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    messages JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- Enable Row Level Security
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own conversations" ON public.ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.ai_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.ai_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at on ai_conversations
CREATE TRIGGER handle_ai_conversations_updated_at
    BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
