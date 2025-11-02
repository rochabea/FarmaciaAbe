// app/(tabs)/notificacoes.tsx
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";

const COLORS = {
  primary: "#242760",
  card: "#F4F4F7",
  white: "#FFFFFF",
  textDark: "#0B0B0B",
  textLink: "#242760",
};

const HEADER_H = 140;
const BELL = 92;
const CONTENT_MAX_W = 560;

export default function NotificacoesScreen() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ]);

  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* HEADER CURVO CUSTOM */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Voltar">
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notificações</Text>

          <View style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          </View>
        </View>

        {/* Sino central sobreposto */}
        <View style={styles.bellWrapper}>
          <View style={styles.bellCircle}>
            <Ionicons name="notifications-outline" size={42} color={COLORS.primary} />
          </View>
        </View>
      </View>

      {/* LISTA DE NOTIFICAÇÕES */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={items}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Text numberOfLines={2} style={styles.cardText}>{item}</Text>
            </View>

            <TouchableOpacity onPress={() => removeItem(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.removeText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ opacity: 0.6 }}>Sem notificações no momento.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },

  header: {
    height: HEADER_H,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    marginTop: 4,
  },

  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },

  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: "700" },

  bellWrapper: {
    position: "absolute",
    bottom: -(BELL / 2) + 6,
    width: "100%",
    alignItems: "center",
  },

  bellCircle: {
    width: BELL,
    height: BELL,
    borderRadius: BELL / 2,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  listContainer: {
    paddingTop: BELL / 2 + 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 12,
  },

  cardRow: {
    width: "94%",
    maxWidth: CONTENT_MAX_W,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  cardLeft: { flex: 1, paddingRight: 12 },
  cardText: { color: COLORS.textDark },
  removeText: { fontWeight: "600", color: COLORS.textLink },
});
