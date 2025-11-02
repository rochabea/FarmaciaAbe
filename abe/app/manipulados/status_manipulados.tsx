import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const NAVY = "#242760";
const CARD = "#F3F4F6";
const GREEN = "#10B981";
const TEXT = "#0B0B0B";
const MUTED = "#6B7280";

export default function StatusPedidoScreen() {
  const router = useRouter();
  const { id, n, d1, d2, d3 } = useLocalSearchParams<{
    id: string;
    n?: string; d1?: string; d2?: string; d3?: string;
  }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status do pedido</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {}}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hero com documento + check */}
      <View style={styles.hero}>
        <Ionicons name="document-text-outline" size={44} color={NAVY} />
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark-circle" size={28} color={GREEN} />
        </View>
      </View>

      {/* Card com passos */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.stepText}>1. Pedido em análise</Text>
          <Text style={styles.dateText}>{d1 ?? "00/00/0000"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.stepText}>2. Solicitação aprovada</Text>
          <Text style={styles.dateText}>{d2 ?? "00/00/0000"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.stepText}>3. Manipulado pronto {"\n"}   pode retirar na farmácia</Text>
          <Text style={styles.dateText}>{d3 ?? "00/00/0000"}</Text>
        </View>
      </View>

      {/* Ações */}
      <View style={{ paddingHorizontal: 16, gap: 12, marginTop: 10 }}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => { /* fluxo entrega */ }}>
          <Text style={styles.primaryTxt}>Solicitar entrega</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => { /* fluxo retirada */ }}>
          <Text style={styles.primaryTxt}>Fazer retirada</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },

  hero: {
    marginTop: -18,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  checkWrap: {
    position: "absolute",
    bottom: -2,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  card: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  stepText: { color: TEXT, fontSize: 14, fontWeight: "600", lineHeight: 18 },
  dateText: { color: MUTED, fontSize: 14, fontWeight: "600" },

  primaryBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
