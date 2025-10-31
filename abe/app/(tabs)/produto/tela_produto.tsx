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
  const { id } = useLocalSearchParams<{ id?: string }>();

  // --- mock simples; troque por fetch/Context quando quiser
  const product: Product = useMemo(
    () => ({
      id: (id as string) || "aspirina",
      name: "Aspirina Ácido Acetilsalicílico 500mg 20 comprimidos",
      subtitle: "Para esse item não é necessário receita médica",
      price: undefined, // “R$ XX,XX”
      image: require("../../../assets/images/remedio.png"),
    }),
    [id]
  );

  const [qty, setQty] = useState(1);
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const onBuy = () => {
    Alert.alert("Carrinho", `${qty}x ${product.name} — ${money(product.price)}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/cesta")} style={styles.hBtn}>
          <Image source={require("../../../assets/images/car.png")} style={styles.hIcon} />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => {}} style={styles.hBtn}>
          <Image
            source={require("../../../assets/images/notificacao.png")}
            style={styles.hIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {/* Títulos */}
        <Text style={styles.sectionKicker}>Detalhes Produto</Text>

        <Pressable onPress={() => {}}>
          <Text style={styles.productTitle}>{product.name}</Text>
        </Pressable>

        {/* Imagem */}
        <Image source={product.image} style={styles.prodImage} resizeMode="contain" />

        {/* Observação + hiperlink para manipulados */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          {!!product.subtitle && <Text style={styles.subtitle}>{product.subtitle}</Text>}

          <TouchableOpacity
            onPress={() => router.push("./manipulados/envio")}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>Enviar para manipulação</Text>
          </TouchableOpacity>
        </View>

        {/* Preço + contador simples “+ 1” */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{money(product.price)}</Text>

          <Pressable onPress={inc} hitSlop={10}>
            <Text style={styles.plusQty}>+ {qty}</Text>
          </Pressable>
        </View>

        {/* Botão Comprar */}
        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.9} onPress={onBuy}>
          <Text style={styles.buyTxt}>Comprar</Text>
        </TouchableOpacity>

        {/* Consultar frete */}
        <Pressable
          onPress={() => Alert.alert("Entrega", "Abrir fluxo para CEP.")}
          style={styles.linkRow}
        >
          <Image
            source={require("../../../assets/images/percent.png")}
            style={{ width: 18, height: 18, tintColor: TEXT, marginRight: 6 }}
          />
          <View>
            <Text style={styles.linkText}>Consultar valor da entrega</Text>
            <Text style={styles.linkSub}>CEP</Text>
          </View>
        </Pressable>

        {/* Checkbox Retirada */}
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>Retirada na loja</Text>
        </View>

        {/* Card “Descrição do produto” */}
        <View style={styles.descWrap}>
          <Text style={styles.descTitle}>Descrição do produto</Text>

          <View style={styles.descCard}>
            <Text style={styles.descText} numberOfLines={6}>
              Lorem ipsum dolor sit amet, Qui libero totam eos voluptatem sed id
              ratione. Assumenda numquam consequatur molestiae sunt, dolores
              mollitia in! Quis velit, recusandae earum eaque dignissimos
              aliquid aspernatur cum explicabo! At iusto ratione et deserunt non
              suscipit. At accusantium cupiditate est nobis accusantium et culpa ipsa.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* —————— ESTILOS —————— */
const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hBtn: { padding: 6 },
  hIcon: { width: 24, height: 24 },
  logo: { width: 84, height: 32 },

  sectionKicker: { marginTop: 6, fontSize: 13, color: TEXT },

  productTitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: NAVY,
    textDecorationLine: "underline",
  },

  prodImage: { width: "100%", height: 150, marginTop: 12 },

  subtitle: {
    textAlign: "center",
    color: GRAY,
    fontSize: 12,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  price: { fontSize: 20, fontWeight: "700", color: TEXT },
  plusQty: { fontSize: 16, fontWeight: "700", color: TEXT },

  buyBtn: {
    marginTop: 8,
    height: 40,
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
  },
  linkText: { fontSize: 14, color: TEXT, textDecorationLine: "underline" },
  linkSub: { fontSize: 12, color: GRAY, marginTop: 2 },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
  },
  checkboxLabel: { color: TEXT, fontSize: 13 },

  descWrap: { marginTop: 8 },
  descTitle: { fontSize: 12, color: TEXT, marginBottom: 6 },

  descCard: {
    backgroundColor: SOFT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
  },
  descText: { fontSize: 12, color: GRAY, lineHeight: 18 },

  link: {
    marginTop: 6,
    color: "#242760",
    textDecorationLine: "underline",
    fontWeight: "600",
    textAlign: "center",
  },
});
