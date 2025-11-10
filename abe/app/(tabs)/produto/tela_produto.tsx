// app/(tabs)/produto/tela_produto.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";

const NAVY = "#242760";
const GRAY = "#6B7280";
const TEXT = "#0B0B0B";
const BORDER = "#E5E7EB";
const SOFT = "#F4F4F7";

type Product = {
  id: string;
  name: string;
  subtitle?: string;
  price?: number;
  image: any; // require(...) ou {uri}
};

const money = (v?: number) =>
  typeof v === "number"
    ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "R$ XX,XX";

export default function TelaProduto() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const product: Product = useMemo(
    () => ({
      id: (id as string) || "aspirina",
      name: "Aspirina Ácido Acetilsalicílico 500mg 20 comprimidos",
      subtitle: "Para esse item não é necessário receita médica",
      price: 19.9,
      image: require("../../../assets/images/remedio.png"),
    }),
    [id]
  );

  const [qty, setQty] = useState(1);
  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onBuy = async () => {
    try {
      await addItem(product.id, qty);
      // Aguarda um pouco para garantir que o carrinho foi atualizado
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push("/cesta");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível adicionar o produto ao carrinho");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.2) }]}>
        <TouchableOpacity
          onPress={() => router.push("/cesta")}
          style={styles.hBtn}
          accessibilityLabel="Abrir cesta"
        >
          <Image source={require("../../../assets/images/car.png")} style={styles.hIcon} />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => {}} style={styles.hBtn} accessibilityLabel="Notificações">
          <Image source={require("../../../assets/images/notificacao.png")} style={styles.hIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionKicker}>Detalhes Produto</Text>

        <Pressable onPress={() => {}}>
          <Text style={styles.productTitle}>{product.name}</Text>
        </Pressable>

        <Image source={product.image} style={styles.prodImage} resizeMode="contain" />

        <View style={{ alignItems: "center", marginTop: 10 }}>
          {!!product.subtitle && <Text style={styles.subtitle}>{product.subtitle}</Text>}

          <TouchableOpacity
            onPress={() => router.push("/manipulados/envio_manipulados")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Enviar para manipulação</Text>
          </TouchableOpacity>
        </View>

        {/* Preço + contador – / qty / + */}
        <View style={styles.priceQtyRow}>
          <Text style={styles.price}>{money(product.price)}</Text>

          <View style={styles.counter}>
            <TouchableOpacity
              onPress={dec}
              disabled={qty === 1}
              style={[styles.ctaBtn, styles.ctaMinus, qty === 1 && styles.ctaDisabled]}
              accessibilityLabel="Diminuir quantidade"
            >
              <Text style={[styles.ctaTxt, qty === 1 && styles.ctaTxtDisabled]}>–</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{qty}</Text>

            <TouchableOpacity
              onPress={inc}
              style={[styles.ctaBtn, styles.ctaPlus]}
              accessibilityLabel="Aumentar quantidade"
            >
              <Text style={styles.ctaTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Comprar */}
        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.9} onPress={onBuy}>
          <Text style={styles.buyTxt}>Comprar</Text>
        </TouchableOpacity>

        {/* Consultar frete */}
        <Pressable
          onPress={() => Alert.alert("Entrega", "Abrir fluxo para CEP.")}
          style={styles.linkRow}
          accessibilityLabel="Consultar valor da entrega"
        >
          <Image source={require("../../../assets/images/percent.png")} style={styles.linkIcon} />
          <View>
            <Text style={styles.linkText}>Consultar valor da entrega</Text>
            <Text style={styles.linkSub}>CEP</Text>
          </View>
        </Pressable>

        {/* Checkbox Retirada */}
        <View style={styles.checkboxWrap}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>Retirada na loja</Text>
        </View>

        {/* Descrição */}
        <View style={styles.descWrap}>
          <Text style={styles.descTitle}>Descrição do produto</Text>

          <View style={styles.descCard}>
            <Text style={styles.descText} numberOfLines={6}>
              Lorem ipsum dolor sit amet, Qui libero totam eos voluptatem sed id ratione.
              Assumenda numquam consequatur molestiae sunt, dolores mollitia in! Quis velit,
              recusandae earum eaque dignissimos aliquid aspernatur cum explicabo! At iusto
              ratione et deserunt non suscipit. At accusantium cupiditate est nobis accusantium
              et culpa ipsa.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* —————— ESTILOS —————— */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  hBtn: { paddingVertical: 6, paddingHorizontal: 6 },
  hIcon: { width: 24, height: 24 },
  logo: { width: 96, height: 34 },

  content: { paddingHorizontal: 16, paddingBottom: 24 },

  sectionKicker: { marginTop: 6, fontSize: 13, color: TEXT },

  productTitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: NAVY,
    textDecorationLine: "underline",
    fontWeight: "700",
  },

  prodImage: { width: "100%", height: 140, marginTop: 12, alignSelf: "center" },

  subtitle: { textAlign: "center", color: GRAY, fontSize: 12 },

  /* Preço + contador */
  priceQtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  price: { fontSize: 20, fontWeight: "700", color: TEXT },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  ctaBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaMinus: { borderRightWidth: 1, borderRightColor: BORDER },
  ctaPlus: { borderLeftWidth: 1, borderLeftColor: BORDER },
  ctaTxt: { fontSize: 20, fontWeight: "700", color: TEXT, lineHeight: 22 },
  ctaDisabled: { backgroundColor: "#F5F5F5" },
  ctaTxtDisabled: { color: "#9CA3AF" },
  qtyValue: { width: 42, textAlign: "center", fontSize: 16, fontWeight: "700", color: TEXT },

  buyBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 8,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  buyTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  linkIcon: { width: 18, height: 18, tintColor: TEXT, marginRight: 6 },
  linkText: { fontSize: 14, color: TEXT, textDecorationLine: "underline" },
  linkSub: { fontSize: 12, color: GRAY, marginTop: 2 },

  checkboxWrap: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
  },
  checkboxLabel: { color: TEXT, fontSize: 13 },

  descWrap: { marginTop: 10 },
  descTitle: { fontSize: 12, color: TEXT, marginBottom: 6, fontWeight: "600" },

  descCard: {
    backgroundColor: SOFT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
  },
  descText: { fontSize: 12, color: GRAY, lineHeight: 18 },
  link: { color: NAVY, fontSize: 13, textDecorationLine: 'underline', marginTop: 4 },
});
