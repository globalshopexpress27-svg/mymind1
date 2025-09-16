/*
# My Mind - Correção da Migração e Criação da Tabela de Chat com IA

Esta migração corrige um erro de dependência e cria a estrutura necessária
para a funcionalidade de chat com IA.

## Query Description:
Esta operação é segura. Ela primeiro garante que a função `handle_updated_at` exista
(usando `CREATE OR REPLACE`) e depois cria a tabela `ai_conversations` para
armazenar o histórico dos chats. Nenhuma tabela ou dado existente será afetado.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function: `handle_updated_at` (criada ou substituída de forma segura)
- Table: `ai_conversations` (nova tabela para o chat)
- Indexes, RLS Policies, Triggers para `ai_conversations`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Sim, adiciona políticas para a nova tabela, garantindo que cada usuário só acesse suas próprias conversas.

## Performance Impact:
- Indexes: Adicionados na nova tabela para otimizar consultas.
- Triggers: Adicionado um trigger na nova tabela.
- Estimated Impact: Mínimo.
*/

-- Função para atualizar o timestamp 'updated_at' (garante que ela exista)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria a tabela para armazenar as conversas com a IA
CREATE TABLE public.ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    messages JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cria um índice para otimizar a busca de conversas por usuário
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- Habilita a Segurança em Nível de Linha (RLS)
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Cria políticas de RLS para garantir que os usuários só possam acessar suas próprias conversas
CREATE POLICY "Users can manage own conversations" ON public.ai_conversations
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Cria um trigger para atualizar automaticamente o campo 'updated_at' em cada modificação
CREATE TRIGGER handle_ai_conversations_updated_at
    BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
