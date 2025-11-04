// app/manipulados/envio_manipulados.tsx (ajuste o caminho se for outro)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
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
      Alert.alert("Selecionar arquivo", "Não foi possível abrir o seletor de documentos.");
    }
  };

  const enviar = () => {
    if (!file) return;
    router.replace("/manipulados/analise");
  };

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "left", "right"]}>
      {/* HEADER no padrão do modelo */}
      <View style={estilos.topo}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/home"))}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require("../../assets/images/seta-esquerda.png")} style={estilos.iconeVoltar} />
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoNotificacao}
          onPress={() => router.push("/notificacao")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={require("../../assets/images/notificacao.png")} style={estilos.iconeNotificacao} />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Manipulação</Text>

        {/* Círculo branco sobreposto com ícone */}
        <View style={estilos.circuloIcone} pointerEvents="none">
          <Ionicons name="medkit-outline" size={42} color={NAVY} />
        </View>
      </View>

      {/* Espaço para não colidir com o círculo */}
      <View style={{ height: 80 }} />

      {/* Instruções */}
      <Text style={estilos.hint}>
        Envie a receita deve estar em uma{"\n"}superfície plana com informações nítidas e{"\n"}sem outros itens por cima.
      </Text>

      {/* Linha de anexo */}
      <TouchableOpacity style={estilos.attachment} activeOpacity={0.8} onPress={pickPdf}>
        <View style={estilos.attachmentLeft}>
          <Ionicons name="document-text-outline" size={20} color={MUTED} />
          <Text style={estilos.attachmentText}>{file?.name ?? "Anexo em PDF"}</Text>
        </View>
        <Ionicons
          name={Platform.OS === "ios" ? "chevron-forward" : "chevron-forward-outline"}
          size={20}
          color={MUTED}
        />
      </TouchableOpacity>

      {/* Botão enviar */}
      <TouchableOpacity
        style={[estilos.primaryBtn, !file && { opacity: 0.5 }]}
        activeOpacity={0.9}
        onPress={enviar}
        disabled={!file}
      >
        <Text style={estilos.primaryTxt}>Enviar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // ===== HEADER (igual ao modelo) =====
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

  // ===== Conteúdo =====
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
