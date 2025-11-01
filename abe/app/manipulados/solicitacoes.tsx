import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Status = "Pendente" | "Aprovado" | "Rejeitado";

type Solicitacao = {
  id: string;
  numero: string;
  dataSolicitacao: string;
  paciente: string;
  anexoLabel?: string;
  status: Status;
};

const MOCK_DATA: Solicitacao[] = [
  {
    id: "1",
    numero: "12345",
    dataSolicitacao: "22/09/2025",
    paciente: "Keven",
    anexoLabel: "Anexo em PDF",
    status: "Pendente",
  },
  {
    id: "2",
    numero: "12346",
    dataSolicitacao: "22/09/2025",
    paciente: "Keven",
    anexoLabel: "Anexo em PDF",
    status: "Pendente",
  },
];

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
          <Text style={styles.detailText}>Nome do paciente/cliente: {item.paciente}</Text>
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header roxo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/(tabs)/conta")
          }
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Aprovações</Text>

        <TouchableOpacity onPress={() => Alert.alert("Alertas", "Notificações ou pendências")}>
          <Ionicons name="alert-circle-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Ícone central */}
      <View style={styles.hero}>
        <Ionicons name="document-text" size={40} color="#4B3E6A" />
        <Ionicons name="checkmark-circle" size={26} color="#34D399" style={{ marginLeft: -10 }} />
      </View>

      {/* Título da seção */}
      <Text style={styles.sectionTitle}>Manipulados solicitados</Text>

      {/* Lista de cards */}
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <SolicitacaoCard
            item={item}
            onPress={() =>
              router.push({ "/manipulados/aprovados",
                params: {
                  id: item.id,
                  n: item.numero,
                  d1: "01/10/2025",
                  d2: "03/10/2025",
                  d3: "—",
                },
              })
            }
          />
        )}
      />

      {/* Botão flutuante */}
      <TouchableOpacity
        onPress={() => Alert.alert("Busca", "Abrir busca de solicitações")}
        style={styles.fab}
      >
        <Ionicons name="search" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- ESTILOS ---------- */
const HEADER_BG = "#2F235A";
const CARD_BG = "#F3F4F6";
const TEXT_PRIMARY = "#111827";
const TEXT_MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    backgroundColor: HEADER_BG,
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
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  hero: {
    marginTop: -18,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
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
});
