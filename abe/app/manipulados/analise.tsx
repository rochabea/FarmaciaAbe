import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const NAVY = "#242760";
const CARD = "#F3F4F6";
const GREEN = "#10B981";

export default function EnviadoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "left", "right"]}>
      {/* HEADER estilo modelo */}
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoNotificacao}
          onPress={() => router.push("/notificacao")}
        >
          <Image
            source={require("../../assets/images/notificacao.png")}
            style={estilos.iconeNotificacao}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Enviado</Text>

        {/* círculo/ícone central sobreposto */}
        <View style={estilos.circuloIcone} pointerEvents="none">
          <Ionicons name="document-text-outline" size={40} color={NAVY} />
          <View style={estilos.checkWrap}>
            <Ionicons name="checkmark-circle" size={28} color={GREEN} />
          </View>
        </View>
      </View>

      {/* Espaço para não colidir com o círculo */}
      <View style={{ height: 80 }} />

      {/* Card de confirmação */}
      <View style={estilos.card}>
        <Ionicons
          name="medkit-outline"
          size={40}
          color={NAVY}
          style={{ alignSelf: "center", marginBottom: 10 }}
        />
        <Text style={estilos.msg}>
          Sua receita foi enviada com{"\n"}sucesso! Em breve você terá{"\n"}atualização do pedido!
        </Text>

        <TouchableOpacity
          style={estilos.primaryBtn}
          activeOpacity={0.9}
          onPress={() => {
            console.log("Botão Visualizar status clicado. ID recebido:", id);
            if (id) {
              // Se tiver ID, vai direto para o status do pedido específico
              console.log("Redirecionando para status com ID:", id);
              router.push({
                pathname: "/manipulados/status_manipulados",
                params: { id: String(id) },
              });
            } else {
              // Caso contrário, vai para a lista de solicitações
              console.log("Sem ID, redirecionando para lista de solicitações");
              router.push("/manipulados/solicitacoes");
            }
          }}
        >
          <Text style={estilos.primaryTxt}>Visualizar status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  /* ===== Header estilo modelo ===== */
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
  iconeVoltar: { width: 30, height: 30, tintColor: "#fff" },
  botaoNotificacao: { position: "absolute", right: 20, top: 70 },
  iconeNotificacao: { width: 30, height: 30, tintColor: "#fff" },

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
