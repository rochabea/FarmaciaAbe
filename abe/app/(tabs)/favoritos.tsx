// app/(tabs)/favoritos.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFavorites } from "../context/FavoritesContext";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  price?: number;
  image_url?: string;
};

export default function FavoritosScreen() {
  const router = useRouter();
  const { list, loading: favLoading, refresh: refreshFavs, toggle } = useFavorites();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const ids = useMemo(() => list.map((f) => f.product_id), [list]);

  const fetchProducts = useCallback(async () => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .in("id", ids);
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    // manter a ordem dos favoritos (created_at desc)
    const orderMap = new Map(list.map((f, idx) => [f.product_id, idx]));
    const ordered = (data ?? []).sort(
      (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
    );
    setProducts(ordered as Product[]);
  }, [ids, list]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFavs();   // atualiza a lista de favoritos (ids)
    await fetchProducts(); // atualiza os produtos
    setRefreshing(false);
  }, [refreshFavs, fetchProducts]);

  if (favLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Carregando favoritos…</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={36} color="#9CA3AF" />
        <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 8 }}>
          Você ainda não favoritou nenhum item.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({ pathname: "/produto/tela_produto", params: { id: item.id } })
          }
          activeOpacity={0.8}
        >
          {/* imagem ou placeholder Ionicons */}
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePh]}>
              <Ionicons name="image-outline" size={28} color="#9CA3AF" />
            </View>
          )}

          <View style={{ flex: 1, marginRight: 8 }}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            {typeof item.price === "number" && (
              <Text style={styles.price}>
                {item.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            )}
          </View>

          {/* botão de desfavoritar inline */}
          <TouchableOpacity
            onPress={() => toggle(item.id)}
            style={styles.heartBtn}
            accessibilityLabel="Remover dos favoritos"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart" size={22} color="#e11d48" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  imagePh: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  price: { marginTop: 4, color: "#374151" },
  heartBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
});
