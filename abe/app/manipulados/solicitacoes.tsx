import React, { memo, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchUserManipulados,
  formatDate,
  type Manipulado,
} from "../../lib/manipulados";
import { useAuth } from "../context/AuthContext";

type Status = "Pendente" | "Aprovado" | "Rejeitado";

type Solicitacao = {
  id: string;
  numero: string;
  dataSolicitacao: string;
  medicacao: string;
  anexoLabel?: string;
  status: Status;
};

/* ---------- CHIP DE STATUS ---------- */
function StatusChip({ status }: { status: Status }) {
  const { bg, fg } = useMemo(() => {
    switch (status) {
      case "Aprovado":
        return { bg: "#E8F5E9", fg: "#2E7D32" };
      case "Rejeitado":
        return { bg: "#FFEBEE", fg: "#C62828" };
      default:
        return { bg: "#ECE7F6", fg: "#4B3E6A" }; // Pendente
    }
  }, [status]);

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color: fg }]}>{status}</Text>
    </View>
  );
}

/* ---------- LINHA DE ANEXO ---------- */
const AttachmentRow = memo(function AttachmentRow({
  label,
  onOpen,
  onDownload,
}: {
  label: string;
  onOpen: () => void;
  onDownload: () => void;
}) {
  return (
    <TouchableOpacity style={styles.attachment} onPress={onOpen} activeOpacity={0.7}>
      <View style={styles.attachmentLeft}>
        <Ionicons name="document-text-outline" size={20} color="#6B7280" />
        <Text style={styles.attachmentText}>{label}</Text>
      </View>
      <TouchableOpacity onPress={onDownload}>
        <Ionicons name="download-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

/* ---------- CARD CLICÁVEL ---------- */
const SolicitacaoCard = memo(function SolicitacaoCard({
  item,
  onPress,
}: {
  item: Solicitacao;
  onPress: () => void;
}) {
  const handleOpen = () => Alert.alert("Abrir anexo", "Aqui abre o PDF da solicitação");
  const handleDownload = () => Alert.alert("Download", "Aqui baixa o PDF");

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        <Text style={styles.cardHint}>Analise os detalhes antes de aprovar ou rejeitar</Text>

        <View style={{ gap: 2 }}>
          <Text style={styles.detailText}>Número da solicitação: {item.numero}</Text>
          <Text style={styles.detailText}>Data da solicitação: {item.dataSolicitacao}</Text>
          <Text style={styles.detailText}>Nome da medicação: {item.medicacao}</Text>
        </View>

        <AttachmentRow
          label={item.anexoLabel ?? "Anexo"}
          onOpen={handleOpen}
          onDownload={handleDownload}
        />

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <StatusChip status={item.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

/* ---------- TELA PRINCIPAL ---------- */
export default function SolicitacoesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertToSolicitacao = (m: Manipulado): Solicitacao => ({
    id: m.id,
    numero: m.numero,
    dataSolicitacao: formatDate(m.created_at),
    medicacao: m.medicacao,
    anexoLabel: m.file_name || "Anexo em PDF",
    status: m.status as Status,
  });

  const loadSolicitacoes = useCallback(
    async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Buscando manipulados do usuário...");
        const manipulados = await fetchUserManipulados();
        console.log("Manipulados encontrados:", manipulados.length);
        const converted = manipulados.map(convertToSolicitacao);
        setSolicitacoes(converted);
      } catch (err: any) {
        console.error("Erro ao carregar manipulados:", err);
        console.error("Detalhes do erro:", JSON.stringify(err, null, 2));
        if (
          err.message?.includes("schema cache") ||
          err.message?.includes("does not exist") ||
          err.message?.includes("relation") ||
          err.message?.includes("table") ||
          err.code === "42P01"
        ) {
          console.warn("Tabela manipulados não encontrada");
          setSolicitacoes([]);
          setError(null);
        } else {
          setError(err.message || "Erro ao carregar solicitações");
          setSolicitacoes([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      loadSolicitacoes();
    }, [loadSolicitacoes])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ===== HEADER FORA DA SAFE AREA ===== */}
      <View style={styles.topo}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/(tabs)/conta")
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNotificacao}
          onPress={() => Alert.alert("Alertas", "Notificações ou pendências")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>Aprovações</Text>

        <View style={styles.circuloIcone} pointerEvents="none">
          <Ionicons name="document-text-outline" size={40} color={HEADER_BG} />
          <Ionicons
            name="checkmark-circle"
            size={26}
            color="#34D399"
            style={{ position: "absolute", right: 8, bottom: 8 }}
          />
        </View>
      </View>

      {/* Espaço para o círculo não cobrir a lista */}
      <View style={{ height: 80 }} />

      {/* ===== CONTEÚDO DENTRO DA SAFE AREA (SEM HEADER) ===== */}
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <Text style={styles.sectionTitle}>Manipulados solicitados</Text>

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <ActivityIndicator size="large" color={HEADER_BG} />
            <Text style={{ marginTop: 10, color: TEXT_MUTED }}>
              Carregando solicitações...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
          >
            <Text
              style={{
                color: "crimson",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Erro ao carregar solicitações
            </Text>
            <Text
              style={{
                color: TEXT_MUTED,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              style={[
                styles.fab,
                { position: "relative", bottom: 0, alignSelf: "center" },
              ]}
              onPress={loadSolicitacoes}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : solicitacoes.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
          >
            <Ionicons name="document-text-outline" size={64} color={TEXT_MUTED} />
            <Text
              style={{
                color: TEXT_MUTED,
                textAlign: "center",
                marginTop: 16,
                fontSize: 16,
              }}
            >
              Nenhum pedido realizado
            </Text>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => router.push("/manipulados/envio_manipulados")}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.newButtonText}>Enviar Novo Pedido</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={solicitacoes}
            keyExtractor={(it) => it.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <SolicitacaoCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/manipulados/status_manipulados",
                    params: {
                      id: item.id,
                      n: item.numero,
                      d1:
                        item.status === "Aprovado" && item.dataSolicitacao
                          ? item.dataSolicitacao
                          : "—",
                      d2:
                        item.status === "Rejeitado" && item.dataSolicitacao
                          ? item.dataSolicitacao
                          : "—",
                      d3: "—",
                    },
                  })
                }
              />
            )}
          />
        )}
      </SafeAreaView>

      {/* FAB continua flutuando sobre tudo */}
      <TouchableOpacity
        onPress={() => router.push("/manipulados/envio_manipulados")}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

/* ---------- ESTILOS ---------- */
const HEADER_BG = "#242760";
const CARD_BG = "#F3F4F6";
const TEXT_PRIMARY = "#111827";
const TEXT_MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  topo: {
    width: "100%",
    height: 200,
    backgroundColor: HEADER_BG,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: CARD_BG,
    padding: 14,
    borderRadius: 12,
  },
  cardHint: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12.5,
    color: TEXT_PRIMARY,
  },

  attachment: {
    marginTop: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attachmentLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  attachmentText: { fontSize: 13, color: "#374151", fontWeight: "600" },

  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLabel: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: "700",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 96,
    alignItems: "center",
  },
  chipText: {
    fontWeight: "700",
    fontSize: 13,
  },

  fab: {
    position: "absolute",
    bottom: 22,
    alignSelf: "center",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: HEADER_BG,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: HEADER_BG,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
