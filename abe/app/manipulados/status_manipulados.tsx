// app/manipulados/status_manipulados.tsx
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

  const goEntrega = () => {
    router.push({
      pathname: "../entrega",   
      params: { id, n },
    });
  };

  const goRetirada = () => {
    router.push({
      pathname: "../retirada",  
      params: { id, n },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {/* ===== HEADER estilo do modelo ===== */}
      <View style={styles.topo}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNotificacao}
          onPress={() => router.push("/notificacao")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>Status do pedido</Text>

        {/* Círculo branco sobreposto com ícone */}
        <View style={styles.circuloIcone} pointerEvents="none">
          <Ionicons name="document-text-outline" size={44} color={NAVY} />
          <View style={styles.checkWrap}>
            <Ionicons name="checkmark-circle" size={28} color={GREEN} />
          </View>
        </View>
      </View>

      {/* Espaço para não colidir com o círculo */}
      <View style={{ height: 80 }} />

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
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={goEntrega}>
          <Text style={styles.primaryTxt}>Solicitar entrega</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={goRetirada}>
          <Text style={styles.primaryTxt}>Fazer retirada</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* ===== Header do modelo ===== */
  topo: {
    width: "100%",
    height: 200,
    backgroundColor: NAVY,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: 40,
  },
  tituloTopo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 30,
  },
  botaoVoltar: { position: "absolute", left: 20, top: 70 },
  botaoNotificacao: { position: "absolute", right: 20, top: 70 },

  circuloIcone: {
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
  checkWrap: {
    position: "absolute",
    bottom: -2,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  /* ===== Conteúdo ===== */
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
