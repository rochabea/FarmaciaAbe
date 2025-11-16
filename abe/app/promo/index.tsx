// app/promo/index.tsx
import React, { memo, useCallback, useState, useEffect } from "react";
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";
import { fetchPromotionProducts, formatPrice, Product } from "../../lib/products";

const NAVY = "#242760";

export default function Promocoes() {
  const router = useRouter();
  const { addItem } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const products = await fetchPromotionProducts();
      setItems(products);
    } catch (error: any) {
      console.error("Erro ao carregar promoções:", error);
      setErrorMsg(error.message || "Não foi possível carregar as promoções");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = useCallback(
    async (p: Product) => {
      try {
        await addItem(p.id, 1);
        // pequeno delay pra garantir atualização do contexto
        await new Promise((r) => setTimeout(r, 250));
        router.push("/cesta");
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível adicionar o produto ao carrinho");
      }
    },
    [addItem, router]
  );

  const handleOpen = useCallback(
    (id: string) => {
      router.push({ pathname: "/produto/tela_produto", params: { id } });
    },
    [router]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require("../../assets/images/seta-esquerda.png")} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Promoções</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require("../../assets/images/notificacaoB.png")} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require("../../assets/images/megafone.png")} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={NAVY} />
          <Text style={styles.loadingText}>Carregando promoções...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro: {errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPromotions}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma promoção disponível no momento.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onBuy={() => handleBuy(item)}
              onOpen={() => handleOpen(item.id)}
            />
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const ProductCard = memo(function ProductCard({
  item,
  onBuy,
  onOpen,
}: {
  item: Product;
  onBuy: () => void;
  onOpen: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const originalPrice = item.original_price_cents || item.price_cents || 0;
  const currentPrice = item.price_cents || 0;
  const discountPercent = item.discount_percent || 
    (originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  // impede cliques duplos e evita "propagar" pro toque do card
  const handleBuyClick = async (e: any) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      await onBuy();
    } finally {
      setBusy(false);
    }
  };

  return (
    // Card inteiro abre a tela do produto
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onOpen}>
      {/* Badge de promoção */}
      {item.is_promotion && discountPercent > 0 && (
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionBadgeText}>-{discountPercent}%</Text>
        </View>
      )}

      <View style={styles.imageWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImg} resizeMode="contain" />
        ) : (
          <Image source={require("../../assets/images/remedio.png")} style={styles.cardImg} resizeMode="contain" />
        )}
      </View>

      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.name}
      </Text>

      {item.is_promotion && originalPrice > currentPrice ? (
        <>
          <Text style={styles.cardSub}>De {formatPrice(originalPrice)} por</Text>
          <Text style={styles.cardPrice}>{formatPrice(currentPrice)}</Text>
        </>
      ) : (
        <Text style={styles.cardPrice}>{formatPrice(currentPrice)}</Text>
      )}

      {/* Botão Comprar (não "vaza" pro onPress do card) */}
      <TouchableOpacity
        style={[styles.buyBtn, busy && { opacity: 0.6 }]}
        activeOpacity={0.9}
        onPress={handleBuyClick}
        disabled={busy}
      >
        <Text style={styles.buyTxt}>{busy ? "Adicionando..." : "Comprar"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

/* estilos */
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", alignItems: "center", paddingBottom: 40 },
  topRect: {
    width: "100%", height: 250, backgroundColor: "#242760",
    borderBottomLeftRadius: 80, borderBottomRightRadius: 80,
    alignItems: "center", justifyContent: "flex-start", position: "relative",
  },
  topTitle: { color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 90 },
  backButton: { position: "absolute", left: 20, top: 98 },
  backIcon: { width: 25, height: 25 },
  notification: { position: "absolute", right: 20, top: 92 },
  notificationIcon: { width: 25, height: 25 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", position: "absolute",
    bottom: -60, borderWidth: 3, borderColor: "#fff",
  },
  sacolaIcon: { width: 70, height: 70 },
  grid: { width: "90%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%", backgroundColor: "#fff", borderRadius: 14,
    paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10,
    marginBottom: 16, elevation: 3, position: "relative",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  promotionBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  promotionBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  imageWrap: {
    borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    marginBottom: 8, alignSelf: "center",
  },
  cardImg: { width: 96, height: 96, resizeMode: "contain" },
  cardTitle: { fontSize: 14, fontWeight: "600", color: NAVY, marginBottom: 4, minHeight: 36 },
  cardSub: { fontSize: 12, color: "#6B6B6B", marginTop: 6, textDecorationLine: "line-through" },
  cardPrice: { fontSize: 14, color: NAVY, fontWeight: "700", marginTop: 2 },
  buyBtn: {
    alignSelf: "flex-start", paddingVertical: 10, paddingHorizontal: 18,
    backgroundColor: NAVY, borderRadius: 12, marginTop: 8,
  },
  buyTxt: { color: "#fff", fontWeight: "600", fontSize: 14 },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    width: "90%",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "90%",
  },
  errorText: {
    fontSize: 14,
    color: "#FF4444",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "90%",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
