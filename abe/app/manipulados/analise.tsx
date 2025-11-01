import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NAVY = "#242760";
const CARD = "#F3F4F6";
const GREEN = "#10B981";
const TEXT = "#0B0B0B";

export default function EnviadoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Enviado</Text>

        <View style={styles.headerBtn} />
      </View>

      {/* Hero com ícone e check */}
      <View style={styles.hero}>
        <Ionicons name="document-text-outline" size={44} color={NAVY} />
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark-circle" size={28} color={GREEN} />
        </View>
      </View>

      {/* Card de confirmação */}
      <View style={styles.card}>
        <Ionicons
          name="medkit-outline"
          size={40}
          color={NAVY}
          style={{ alignSelf: "center", marginBottom: 10 }}
        />
        <Text style={styles.msg}>
          Sua receita foi enviada com{'\n'}sucesso! Em breve você terá{'\n'}atualização do pedido!
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.9}
          onPress={() => router.push("/manipulados/solicitacoes")}
        >
          <Text style={styles.primaryTxt}>Visualizar status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },

  hero: {
    marginTop: -18,
    alignSelf: "center",
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
  },
  msg: {
    textAlign: "center",
    color: GREEN,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },

  primaryBtn: {
    alignSelf: "center",
    marginTop: 6,
    width: "80%",
    height: 44,
    borderRadius: 8,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
