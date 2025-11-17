import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ session: Session | null; user: User | null } | undefined>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega a sessão inicial
  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.session) throw new Error("Falha ao fazer login");
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, metadata?: Record<string, any>) => {
      console.log('=== AuthContext.signUp ===');
      console.log('Email:', email);
      console.log('Metadata:', metadata);
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
            emailRedirectTo: undefined, // Não precisa de redirecionamento
          },
        });

        console.log('Supabase response - Error:', error);
        console.log('Supabase response - Data:', data);
        console.log('Supabase response - Session:', data?.session ? 'SIM' : 'NÃO');
        console.log('Supabase response - User:', data?.user ? 'SIM' : 'NÃO');

        if (error) {
          console.error('Erro do Supabase:', error);
          throw error;
        }
        
        if (!data.user) {
          console.error('Nenhum usuário retornado');
          throw new Error("Falha ao criar conta");
        }
        
        // Se houver sessão criada automaticamente (email auto-confirmado), atualiza o estado
        if (data.session) {
          console.log('Atualizando estado com sessão');
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('Sem sessão - email precisa ser confirmado');
        }
        
        // Retorna os dados para que a tela de cadastro possa verificar se houve sessão
        return data;
      } catch (err: any) {
        console.error('Erro capturado no signUp:', err);
        throw err;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // garante que estado local também zere (mesmo que o listener faça isso)
    setSession(null);
    setUser(null);

    //  manda SEMPRE pra tela de bem-vindo
    router.replace("/bemvindo");
  }, [router]);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

