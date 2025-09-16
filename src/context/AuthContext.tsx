import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange é a única fonte de verdade.
    // Ele dispara imediatamente com a sessão atual no carregamento da página.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (error) {
            console.error('Erro ao buscar perfil:', error);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } catch (e) {
          console.error('Exceção ao buscar perfil:', e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      // O carregamento inicial termina após a primeira verificação do estado de autenticação.
      setLoading(false);
    });

    // Limpa a inscrição quando o componente é desmontado.
    return () => {
      subscription.unsubscribe();
    };
  }, []); // O array vazio garante que este efeito execute apenas uma vez.

  const signUp = async (email: string, password:string, fullName: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  // Renderiza os filhos apenas quando o carregamento não está mais em andamento,
  // ou renderiza um provedor "vazio" para evitar que os filhos acessem um contexto indefinido.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
