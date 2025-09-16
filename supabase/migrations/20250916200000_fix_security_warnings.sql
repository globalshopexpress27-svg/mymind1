/*
# Correção de Avisos de Segurança

Esta migração corrige o aviso "Function Search Path Mutable" emitido pelo Supabase,
tornando as funções do banco de dados mais seguras.

## Query Description:
Esta operação define um "caminho de busca" explícito para as funções existentes.
Isso impede que um usuário mal-intencionado possa executar código inesperado,
aumentando a segurança geral do banco de dados. A alteração não afeta a
funcionalidade do aplicativo.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifica as funções:
  - public.handle_new_user()
  - public.handle_updated_at()

## Security Implications:
- RLS Status: No change
- Policy Changes: No
- Auth Requirements: Mitiga um vetor de ataque potencial.
*/

-- Define um search_path seguro para a função que cria o perfil do usuário.
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Define um search_path seguro para a função que atualiza o timestamp.
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
