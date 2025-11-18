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
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price_cents, image_url")
        .in("id", ids);

      if (error) {
        console.error("Erro ao buscar produtos favoritos:", error);
        setProducts([]);
        return;
      }

      const productsWithPrice = (data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price_cents ? p.price_cents / 100 : undefined,
        image_url: p.image_url,
      }));

      const orderMap = new Map(list.map((f, idx) => [f.product_id, idx]));
      const ordered = productsWithPrice.sort(
        (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
      );
      setProducts(ordered as Product[]);
    } catch (err: any) {
      console.error("Erro ao buscar produtos:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [ids, list]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useFocusEffect(
    useCallback(() => {
      refreshFavs();
    }, [refreshFavs])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFavs();
    await fetchProducts();
    setRefreshing(false);
  }, [refreshFavs, fetchProducts]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ------- HEADER FORA DA SAFE AREA ------- */}
      <View style={styles.topRect}>
        {/* Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.topTitle}>Produtos favoritos</Text>

        {/* Notificação */}
        <TouchableOpacity
          style={styles.notification}
          onPress={() => router.push("/notificacao")}
        >
          <Image
            source={require("../../assets/images/notificacaoB.png")}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>

        {/* Ícone central no círculo branco */}
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={48} color="#242760" />
        </View>
      </View>

      {/* Espaço para não colidir com o círculo */}
      <View style={{ height: 80 }} />

      {/* ------- CONTEÚDO DENTRO DA SAFE AREA ------- */}
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        {favLoading || loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#242760" />
            <Text style={{ marginTop: 8 }}>Carregando favoritos…</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="heart-outline" size={36} color="#9CA3AF" />
            <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 8 }}>
              Você ainda não favoritou nenhum item.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/produto/tela_produto",
                    params: { id: item.id },
                  })
                }
                activeOpacity={0.8}
              >
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

                <TouchableOpacity
                  onPress={() => toggle(item.id)}
                  style={styles.heartBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="heart" size={22} color="#e11d48" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topRect: {
    width: "100%",
    height: 250,
    backgroundColor: "#242760",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },

  topTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 90,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 98,
  },

  backIcon: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  },

  notification: {
    position: "absolute",
    right: 20,
    top: 92,
  },

  notificationIcon: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -60,
    borderWidth: 3,
    borderColor: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

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

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  price: {
    marginTop: 4,
    color: "#374151",
  },

  heartBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
});
