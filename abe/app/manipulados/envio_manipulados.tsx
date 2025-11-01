import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const NAVY = "#242760";
const TEXT = "#0B0B0B";
const MUTED = "#6B7280";
const CARD = "#F3F4F6";

export default function EnvioManipulados() {
  const router = useRouter();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      setFile(res.assets[0]);
    } catch (e: any) {
      Alert.alert(
        "Selecionar arquivo",
        "Não foi possível abrir o seletor de documentos."
      );
    }
  };

  const enviar = () => {
    if (!file) return;
    router.replace("/manipulados/analise");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)/conta"))}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Manipulação</Text>

        <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert("Notificações")}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hero redondo */}
      <View style={styles.hero}>
        <Ionicons name="medkit-outline" size={42} color={NAVY} />
      </View>

      {/* Instruções */}
      <Text style={styles.hint}>
        Envie a receita deve estar em uma{"\n"}superfície plana com informações nítidas e{"\n"}
        sem outros itens por cima.
      </Text>

      {/* Linha de anexo */}
      <TouchableOpacity style={styles.attachment} activeOpacity={0.8} onPress={pickPdf}>
        <View style={styles.attachmentLeft}>
          <Ionicons name="document-text-outline" size={20} color={MUTED} />
          <Text style={styles.attachmentText}>{file?.name ?? "Anexo em PDF"}</Text>
        </View>
        <Ionicons
          name={Platform.OS === "ios" ? "chevron-forward" : "chevron-forward-outline"}
          size={20}
          color={MUTED}
        />
      </TouchableOpacity>

      {/* Botão enviar */}
      <TouchableOpacity
        style={[styles.primaryBtn, !file && { opacity: 0.5 }]}
        activeOpacity={0.9}
        onPress={enviar}
        disabled={!file}
      >
        <Text style={styles.primaryTxt}>Enviar</Text>
      </TouchableOpacity>
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
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

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

  hint: {
    marginTop: 8,
    textAlign: "center",
    color: TEXT,
    paddingHorizontal: 24,
    lineHeight: 18,
    fontSize: 13,
    fontWeight: "600",
  },

  attachment: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: CARD,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attachmentLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  attachmentText: { fontSize: 14, color: TEXT, fontWeight: "600" },

  primaryBtn: {
    marginTop: 20,
    alignSelf: "center",
    width: "88%",
    height: 44,
    borderRadius: 8,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
