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
    const { data, error } = await supabase
      .from("favorites")
      .select("product_id, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }
    setList(data ?? []);
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

    if (optimisticWasFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);
      if (error) {
        // rollback
        setList(prev => prev); // (não precisamos mexer; o próximo refresh corrige)
        Alert.alert("Erro", error.message);
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ product_id: productId, user_id: user.id });
      if (error) {
        // rollback
        setList(prev => prev.filter(f => f.product_id !== productId));
        Alert.alert("Erro", error.message);
      }
    }
  }, [user, ids]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = { ids, list, loading, refresh, toggle, isFav };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
