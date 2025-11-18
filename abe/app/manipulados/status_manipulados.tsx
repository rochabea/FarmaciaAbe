// app/manipulados/status_manipulados.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchManipuladoById, formatDate, type Manipulado } from "../../lib/manipulados";

const NAVY = "#242760";
const CARD = "#F3F4F6";
const GREEN = "#10B981";
const TEXT = "#0B0B0B";
const MUTED = "#6B7280";

export default function StatusPedidoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [manipulado, setManipulado] = useState<Manipulado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadManipulado = async () => {
      if (!id) {
        console.warn("ID do manipulado não fornecido");
        setError("ID do manipulado não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Buscando manipulado com ID:", id);
        const data = await fetchManipuladoById(String(id));

        if (!data) {
          console.warn("Manipulado não encontrado para ID:", id);
          setError("Manipulado não encontrado");
        } else {
          console.log("Manipulado encontrado:", data.id);
          setManipulado(data);
        }
      } catch (err: any) {
        console.error("Erro ao carregar manipulado:", err);
        console.error("Detalhes do erro:", JSON.stringify(err, null, 2));

        if (
          err.message?.includes("schema cache") ||
          err.message?.includes("does not exist") ||
          err.message?.includes("relation") ||
          err.message?.includes("table") ||
          err.code === "42P01"
        ) {
          setError("TABELA_NAO_EXISTE");
        } else {
          setError(err.message || "Erro ao carregar dados do manipulado");
        }
      } finally {
        setLoading(false);
      }
    };

    loadManipulado();
  }, [id]);

  const goEntrega = () => {
    if (!manipulado) return;
    router.push({
      pathname: "../entrega",
      params: { id: manipulado.id, n: manipulado.numero },
    });
  };

  const goRetirada = () => {
    if (!manipulado) return;
    router.push({
      pathname: "../retirada",
      params: { id: manipulado.id, n: manipulado.numero },
    });
  };

  // Erro de tabela não existente
  const isTableError =
    error === "TABELA_NAO_EXISTE" ||
    error?.includes("schema cache") ||
    error?.includes("does not exist") ||
    error?.includes("relation") ||
    error?.includes("table");

  // Datas (só usadas quando tem manipulado e não está carregando/erro)
  const dataSolicitacao =
    manipulado && formatDate(manipulado.created_at);
  const dataAprovacao =
    manipulado && manipulado.data_aprovacao
      ? formatDate(manipulado.data_aprovacao)
      : "—";
  const dataPronto =
    manipulado &&
    manipulado.status === "Aprovado" &&
    manipulado.updated_at
      ? formatDate(manipulado.updated_at)
      : "—";

  const showErrorScreen = !loading && (error || !manipulado);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ===== HEADER FORA DA SAFE AREA ===== */}
      <View style={styles.topo}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.push("/(tabs)/home")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {!loading && !showErrorScreen && (
          <TouchableOpacity
            style={styles.botaoNotificacao}
            onPress={() => router.push("/notificacao")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <Text style={styles.tituloTopo}>Status do pedido</Text>

        {/* Círculo branco com ícone - só mostra na tela principal */}
        {!loading && !showErrorScreen && (
          <View style={styles.circuloIcone} pointerEvents="none">
            <Ionicons name="document-text-outline" size={44} color={NAVY} />
            <View style={styles.checkWrap}>
              <Ionicons name="checkmark-circle" size={28} color={GREEN} />
            </View>
          </View>
        )}
      </View>

      {/* Espaço para não colidir com o círculo (na tela principal) */}
      {!loading && !showErrorScreen && <View style={{ height: 80 }} />}

      {/* ===== CONTEÚDO DENTRO DA SAFE AREA (SEM HEADER) ===== */}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["left", "right"]}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={NAVY} />
            <Text style={{ marginTop: 10, color: MUTED }}>
              Carregando dados...
            </Text>
          </View>
        ) : showErrorScreen ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Ionicons name="document-text-outline" size={64} color={MUTED} />
            <Text
              style={{
                color: TEXT,
                fontSize: 16,
                fontWeight: "700",
                marginTop: 16,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {isTableError
                ? "Funcionalidade não configurada"
                : "Pedido não encontrado"}
            </Text>
            <Text
              style={{
                color: MUTED,
                textAlign: "center",
                marginBottom: 20,
                lineHeight: 20,
              }}
            >
              {isTableError
                ? "A tabela de manipulados não existe no banco de dados. Por favor, execute o script SQL em 'lib/manipulados.sql' no Supabase para criar a tabela."
                : error === "ID do manipulado não fornecido"
                ? "O ID do pedido não foi fornecido. Tente acessar através da lista de pedidos."
                : "O pedido solicitado não foi encontrado. Ele pode não ter sido salvo corretamente."}
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 10 }]}
              onPress={() => router.push("/manipulados/solicitacoes")}
            >
              <Text style={styles.primaryTxt}>Ver Meus Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                {
                  marginTop: 10,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: NAVY,
                },
              ]}
              onPress={() => router.back()}
            >
              <Text style={[styles.primaryTxt, { color: NAVY }]}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Informações do pedido */}
            <View
              style={[styles.card, { marginHorizontal: 16, marginBottom: 12 }]}
            >
              <Text style={styles.infoTitle}>Informações do Pedido</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Número da solicitação:</Text>
                <Text style={styles.infoValue}>{manipulado?.numero}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Medicação:</Text>
                <Text style={styles.infoValue}>{manipulado?.medicacao}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    manipulado?.status === "Aprovado" && {
                      backgroundColor: "#E8F5E9",
                    },
                    manipulado?.status === "Rejeitado" && {
                      backgroundColor: "#FFEBEE",
                    },
                    manipulado?.status === "Pendente" && {
                      backgroundColor: "#ECE7F6",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      manipulado?.status === "Aprovado" && {
                        color: "#2E7D32",
                      },
                      manipulado?.status === "Rejeitado" && {
                        color: "#C62828",
                      },
                      manipulado?.status === "Pendente" && {
                        color: "#4B3E6A",
                      },
                    ]}
                  >
                    {manipulado?.status}
                  </Text>
                </View>
              </View>
              {manipulado?.file_name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Arquivo:</Text>
                  <Text style={styles.infoValue}>{manipulado.file_name}</Text>
                </View>
              )}
            </View>

            {/* Card com passos */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.stepText}>1. Pedido em análise</Text>
                <Text style={styles.dateText}>{dataSolicitacao}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.stepText}>2. Solicitação aprovada</Text>
                <Text style={styles.dateText}>{dataAprovacao}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.stepText}>
                  3. Manipulado pronto {"\n"}   pode retirar na farmácia
                </Text>
                <Text style={styles.dateText}>{dataPronto}</Text>
              </View>
            </View>

            {/* Ações */}
            {manipulado?.status === "Aprovado" && (
              <View
                style={{
                  paddingHorizontal: 16,
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={styles.primaryBtn}
                  activeOpacity={0.9}
                  onPress={goEntrega}
                >
                  <Text style={styles.primaryTxt}>Solicitar entrega</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  activeOpacity={0.9}
                  onPress={goRetirada}
                >
                  <Text style={styles.primaryTxt}>Fazer retirada</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
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

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: MUTED,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: TEXT,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 96,
    alignItems: "center",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 13,
  },
});
