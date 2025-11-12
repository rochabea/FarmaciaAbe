// app/promo/index.tsx
import React, { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext"; // <-- ajuste se necessário

type Product = { id: string; name: string; price: number; image: any };

const DATA: Product[] = [
  { id: "1", name: "Aspirina",    price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "2", name: "Paracetamol", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "3", name: "Ibuprofeno",  price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "4", name: "Vitamina C",  price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "5", name: "Aspirina",    price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "6", name: "Paracetamol", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "7", name: "Ibuprofeno",  price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "8", name: "Vitamina C",  price: 10.99, image: require("../../assets/images/remedio.png") },
];

const NAVY = "#242760";

export default function Promocoes() {
  const router = useRouter();
  const { addItem } = useCart();
  const [itens] = useState(DATA); 

  const handleBuy = useCallback(
    async (p: Product) => {
      try {
        await addItem(p.id, 1);
        // Aguarda um pouco para garantir que o carrinho foi atualizado
        await new Promise(resolve => setTimeout(resolve, 300));
        router.push("/cesta");
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível adicionar o produto ao carrinho");
      }
    },
    [addItem, router]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Header */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* título do header desta tela */}
        <Text style={styles.topTitle}>Promoções</Text>

        <TouchableOpacity
          style={styles.notification}
          onPress={() => router.push("/notificacao")}
        >
          <Image
            source={require("../../assets/images/notificacaoB.png")}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image
            source={require("../../assets/images/megafone.png")}
            style={styles.sacolaIcon}
          />
        </View>
      </View>

      {/* espaçador para o círculo sobrepor corretamente */}
      <View style={{ height: 80 }} />

      {/* ===== Grid simples de itens (2 colunas) ===== */}
      <View style={styles.grid}>
        {itens.map((item) => (
          <ProductCard key={item.id} item={item} onBuy={() => handleBuy(item)} />
        ))}
      </View>

      {/* respiro inferior */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const ProductCard = memo(function ProductCard({
  item,
  onBuy,
}: {
  item: Product;
  onBuy: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.cardImg} resizeMode="contain" />
      </View>

      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.name}
      </Text>
      <Text style={styles.cardSub}>De R$ 10,99 por</Text>
      <Text style={styles.cardPrice}>{item.price.toFixed(2).replace(".", ",")}</Text>

      <TouchableOpacity style={styles.buyBtn} activeOpacity={0.9} onPress={onBuy}>
        <Text style={styles.buyTxt}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );
});

/* =================== estilos =================== */
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
  backButton: {
    position: "absolute",
    left: 20,
    top: 98,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  notification: {
    position: "absolute",
    right: 20,
    top: 92,
  },
  notificationIcon: {
    width: 25,
    height: 25,
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
  sacolaIcon: {
    width: 70,
    height: 70,
  },

  // GRID (2 colunas) — simples via flex-wrap
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // CARD
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
  cardImg: { width: 96, height: 96, resizeMode: "contain" },

  cardTitle: { fontSize: 14, fontWeight: "600", color: NAVY, textDecorationLine: "underline" },
  cardSub: { fontSize: 12, color: "#6B6B6B", marginTop: 6 },
  cardPrice: { fontSize: 14, color: NAVY, fontWeight: "700" },

  buyBtn: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: NAVY,
    borderRadius: 12,
    marginTop: 8,
  },
  buyTxt: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export {};
