import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// se preferir, troque por: import { View, Text } from "react-native";
import { View, Text } from "@/components/Themed";

const COLORS = {
  primary: "#242760",
  card: "#F4F4F7",
  white: "#FFFFFF",
  text: "#0B0B0B",
  link: "#242760",
};

const HEADER_H = 160; // um pouco maior pra curva
const BELL = 90;
const MAX_W = 420;

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([
    "Seu pedido #1234 saiu para entrega.",
    "Promoção: 10% OFF em vitaminas até hoje!",
  ]);

  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* HEADER FULL-BLEED (fora do container) */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} accessibilityLabel="Voltar">
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notificações</Text>

          <View style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          </View>
        </View>

        {/* Sino central */}
        <View style={styles.bellWrapper}>
          <View style={styles.bellCircle}>
            <Ionicons name="notifications-outline" size={40} color={COLORS.primary} />
          </View>
        </View>
      </View>

      {/* CONTAINER CENTRALIZADO DO CONTEÚDO */}
      <View style={styles.page}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item}</Text>
              <TouchableOpacity onPress={() => remove(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.remove}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Text style={{ opacity: 0.6 }}>Sem notificações.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  /* HEADER ocupa 100% da tela (sem borda branca ao redor) */
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_H,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerRow: {
    height: 50,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: "700" },

  bellWrapper: {
    position: "absolute",
    bottom: -(BELL / 2) + 8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bellCircle: {
    width: BELL,
    height: BELL,
    borderRadius: BELL / 2,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 11,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  /* Conteúdo centralizado; dá espaço pro header + sino sobreposto */
  page: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: MAX_W,
    paddingHorizontal: 16,
    paddingTop: HEADER_H / 2 + BELL / 2 + 24, // afasta do header curvo + sino
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardText: { color: COLORS.text, flex: 1, paddingRight: 12 },
  remove: { color: COLORS.link, fontWeight: "600" },
});
