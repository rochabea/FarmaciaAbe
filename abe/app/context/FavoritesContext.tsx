import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase"; // mesmo client que você já usa
import { useAuth } from "./AuthContext";

type Favorite = { product_id: string; created_at: string };
type FavoritesContextType = {
  ids: Set<string>;
  list: Favorite[];
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isFav: (productId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  ids: new Set(),
  list: [],
  loading: false,
  refresh: async () => {},
  toggle: async () => {},
  isFav: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [list, setList] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const ids = useMemo(() => new Set(list.map((f) => f.product_id)), [list]);

  const refresh = useCallback(async () => {
    if (!user) {
      setList([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        // Se a tabela não existir, retorna array vazio silenciosamente
        if (
          error.code === "PGRST116" ||
          error.message?.includes("does not exist") ||
          error.message?.includes("schema cache") ||
          error.message?.includes("relation") ||
          error.message?.includes("table") ||
          error.code === "42P01"
        ) {
          console.warn("Tabela favorites não encontrada. Retornando array vazio.");
          setList([]);
        } else {
          console.error("Erro ao buscar favoritos:", error);
          Alert.alert("Erro", error.message);
        }
        return;
      }
      setList(data ?? []);
    } catch (err: any) {
      console.error("Erro ao buscar favoritos:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isFav = useCallback((productId: string) => ids.has(productId), [ids]);

  const toggle = useCallback(async (productId: string) => {
    if (!user) {
      Alert.alert("Faça login", "Você precisa estar logada(o) para favoritar.");
      return;
    }

    // UI otimista
    const optimisticWasFav = ids.has(productId);
    if (optimisticWasFav) {
      setList(prev => prev.filter(f => f.product_id !== productId));
    } else {
      setList(prev => [{ product_id: productId, created_at: new Date().toISOString() }, ...prev]);
    }

    try {
      if (optimisticWasFav) {
        // Remove dos favoritos
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", user.id);
        
        if (error) {
          // rollback
          setList(prev => [...prev, { product_id: productId, created_at: new Date().toISOString() }]);
          
          // Se a tabela não existir, não mostra erro
          if (
            error.message?.includes("schema cache") ||
            error.message?.includes("does not exist") ||
            error.message?.includes("relation") ||
            error.message?.includes("table") ||
            error.code === "42P01"
          ) {
            console.warn("Tabela favorites não encontrada.");
            return;
          }
          Alert.alert("Erro", error.message);
        } else {
          // Atualiza a lista após sucesso
          await refresh();
        }
      } else {
        // Adiciona aos favoritos
        const { error } = await supabase
          .from("favorites")
          .insert({ product_id: productId, user_id: user.id });
        
        if (error) {
          // rollback
          setList(prev => prev.filter(f => f.product_id !== productId));
          
          // Se a tabela não existir, não mostra erro
          if (
            error.message?.includes("schema cache") ||
            error.message?.includes("does not exist") ||
            error.message?.includes("relation") ||
            error.message?.includes("table") ||
            error.code === "42P01"
          ) {
            console.warn("Tabela favorites não encontrada.");
            return;
          }
          Alert.alert("Erro", error.message);
        } else {
          // Atualiza a lista após sucesso
          await refresh();
        }
      }
    } catch (err: any) {
      console.error("Erro ao alternar favorito:", err);
      // Rollback em caso de erro
      if (optimisticWasFav) {
        setList(prev => [...prev, { product_id: productId, created_at: new Date().toISOString() }]);
      } else {
        setList(prev => prev.filter(f => f.product_id !== productId));
      }
    }
  }, [user, ids, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = { ids, list, loading, refresh, toggle, isFav };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
