// app/promo/index.tsx
import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar, { TAB_BAR_HEIGHT } from "../../components/CustomTabBar";

type Product = { id: string; name: string; price: number; image: any };

const DATA: Product[] = [
  { id: "1", name: "Aspirina", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "2", name: "Paracetamol", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "3", name: "Ibuprofeno", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "4", name: "Vitamina C", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "5", name: "Aspirina", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "6", name: "Paracetamol", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "7", name: "Ibuprofeno", price: 10.99, image: require("../../assets/images/remedio.png") },
  { id: "8", name: "Vitamina C", price: 10.99, image: require("../../assets/images/remedio.png") },
];

const NAVY = "#242760";
const GAP = 16;
const COLS = 2;

export default function Promocoes() {
  const router = useRouter();
  const [notifVisible, setNotifVisible] = useState(false);

  const goHome = () => router.replace("/(tabs)/home");

  return (
    <View style={styles.container}>
      {/* HEADER com recorte e badge */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={goHome}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Promoções</Text>

          <TouchableOpacity
            onPress={() => setNotifVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* recorte branco + badge central */}
        <View style={styles.cutout} />
        <View style={styles.badge}>
          <View style={styles.badgeSquare}>
            <Image
              source={require("../../assets/images/megafone.png")}
              style={styles.badgeIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* CONTEÚDO com espaço para a tab bar */}
      <View style={styles.content}>
        <View pointerEvents="none" style={styles.verticalDivider} />
        <FlatList
          data={DATA}
          keyExtractor={(i) => i.id}
          numColumns={COLS}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: TAB_BAR_HEIGHT + 16,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard item={item} />}
        />
      </View>

      {/* Tab bar fixa no rodapé */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <CustomTabBar />
      </View>

      {/* Modal simples de notificações */}
      <Modal
        visible={notifVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: NAVY, marginBottom: 8 }}>
              Notificações
            </Text>
            <Text style={{ color: "#333", marginBottom: 12 }}>
              Você não possui novas notificações.
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setNotifVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ProductCard = memo(({ item }: { item: Product }) => (
  <View style={styles.card}>
    <View style={styles.imageWrap}>
      <Image source={item.image} style={styles.cardImg} resizeMode="contain" />
    </View>

    <View style={{ width: "100%" }}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.name}
      </Text>
      <Text style={styles.cardSub}>De R$ 10,99 por</Text>
      <Text style={styles.cardPrice}>9,99</Text>
    </View>

    <TouchableOpacity activeOpacity={0.9} style={styles.buyBtn}>
      <Text style={styles.buyTxt}>Comprar</Text>
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },

  // HEADER
  header: {
    backgroundColor: NAVY,
    paddingTop: 12,
    paddingBottom: 72,                // mais espaço para o recorte
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "visible",
  },
  headerRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    position: "absolute",            // garante centralização independente dos ícones
    left: 0,
    right: 0,
    textAlign: "center",
  },

  // recorte branco (semicírculo para baixo)
  cutout: {
    position: "absolute",
    bottom: -35,
    alignSelf: "center",
    width: 150,
    height: 70,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    zIndex: 1,
  },

  // badge por cima do recorte
  badge: {
    position: "absolute",
    bottom: -28,
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
    borderColor: "#E9ECF5",
    zIndex: 2,
  },
  badgeSquare: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    width: 28,
    height: 28,
    // remova a linha abaixo se seu megafone.png for colorido
    // tintColor: NAVY,
  },

  // CONTEÚDO
  content: { flex: 1, paddingTop: 40 },
  verticalDivider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "#EDEFF5",
  },

  // CARD
  card: {
    flex: 1,
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

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: NAVY,
    textDecorationLine: "underline",
  },
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

  // container da tab bar fixa
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
  modalBtn: {
    marginTop: 8,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
