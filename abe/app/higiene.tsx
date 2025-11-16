// app/medicamentos.tsx
import React, { useEffect, useMemo, useState, memo } from "react";
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "./context/CartContext";
import { fetchProductsByCategory, formatPrice, Product } from "../lib/products";

const NAVY = "#242760";

export default function Medicamentos() {
  const router = useRouter();
  const { addItem } = useCart();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErrorMsg(null);
        setLoading(true);
        const products = await fetchProductsByCategory("Higiene", 50);
        setItems(products);
      } catch (e: any) {
        setErrorMsg(e.message || "Falha ao carregar produtos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBuy = async (p: Product, e?: any) => {
    if (e) e.stopPropagation();
    try {
      await addItem(p.id, 1);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/cesta");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível adicionar o produto ao carrinho");
    }
  };

  // >>> NOVO: abrir a tela do produto com o id
  const handleOpen = (id: string) => {
    router.push({ pathname: "/produto/tela_produto", params: { id } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require("../assets/images/seta-esquerda.png")} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Higiene</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require("../assets/images/notificacaoB.png")} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require("../assets/images/higiene.png")} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* ===== Conteúdo ===== */}
      {loading ? (
        <View style={{ paddingTop: 24, alignItems: "center" }}>
          <ActivityIndicator color={NAVY} />
          <Text style={{ color: "#666", marginTop: 8 }}>Carregando...</Text>
        </View>
      ) : errorMsg ? (
        <View style={{ width: "90%", alignItems: "center" }}>
          <Text style={{ color: "crimson", fontWeight: "700", textAlign: "center" }}>
            Erro: {errorMsg}
          </Text>
          <Text style={{ color: "#666", textAlign: "center", marginTop: 6 }}>
            Verifique sua conexão e tente novamente.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onBuy={(e) => handleBuy(item, e)}
              onOpen={() => handleOpen(item.id)}
            />
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ===== Card de Produto (2 colunas) ===== */
const ProductCard = memo(function ProductCard({
  item,
  onBuy,
  onOpen,
}: {
  item: Product;
  onBuy: (e?: any) => void;
  onOpen: () => void;
}) {
  const originalPrice = item.original_price_cents || item.price_cents || 0;
  const currentPrice = item.price_cents || 0;
  const discountPercent = item.discount_percent || 
    (originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
  const isPromotion = item.is_promotion && originalPrice > currentPrice;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onOpen}>
      {/* Badge de promoção */}
      {isPromotion && discountPercent > 0 && (
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionBadgeText}>-{discountPercent}%</Text>
        </View>
      )}

      <View style={styles.imageWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImg} />
        ) : (
          <Image source={require("../assets/images/remedio.png")} style={styles.cardImg} />
        )}
      </View>

      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.name}
      </Text>

      {isPromotion ? (
        <>
          <Text style={styles.cardSub}>
            De <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text> por
          </Text>
          <Text style={styles.cardPrice}>{formatPrice(currentPrice)}</Text>
        </>
      ) : (
        <Text style={styles.cardSub}>
          Oferta por <Text style={styles.cardPrice}>{formatPrice(currentPrice)}</Text>
        </Text>
      )}

      {/* Botão Comprar */}
      <TouchableOpacity 
        style={styles.buyBtn} 
        activeOpacity={0.9} 
        onPress={(e) => onBuy(e)}
      >
        <Text style={styles.buyTxt}>Comprar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

/* ===== Estilos ===== */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingBottom: 40,
  },

  // HEADER
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
  backButton: { position: "absolute", left: 20, top: 98 },
  backIcon: { width: 25, height: 25 },
  notification: { position: "absolute", right: 20, top: 92 },
  notificationIcon: { width: 25, height: 25 },
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
  sacolaIcon: { width: 70, height: 70 },

  // GRID
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Card
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
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
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
    alignSelf: "center",
  },
  cardImg: { width: 110, height: 160, resizeMode: "cover" },

  cardTitle: { fontSize: 14, fontWeight: "600", color: "#2B3A8A", marginBottom: 4, minHeight: 36 },
  cardSub: { fontSize: 14, color: "#111", marginBottom: 4 },
  originalPrice: { textDecorationLine: "line-through", color: "#999", fontSize: 12 },
  cardPrice: { fontWeight: "700", color: "#111", fontSize: 16 },

  // botão
  buyBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: NAVY,
    borderRadius: 18,
  },
  buyTxt: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export {};
