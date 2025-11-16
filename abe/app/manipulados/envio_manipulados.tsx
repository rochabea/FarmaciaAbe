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
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { createManipulado } from "../../lib/manipulados";
import { supabase } from "../../lib/supabase";

const NAVY = "#242760";
const TEXT = "#0B0B0B";
const MUTED = "#6B7280";
const CARD = "#F3F4F6";

export default function EnvioManipulados() {
  const router = useRouter();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [paciente, setPaciente] = useState("");
  const [loading, setLoading] = useState(false);

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

  const enviar = async () => {
    if (!file) {
      Alert.alert("Atenção", "Por favor, selecione um arquivo PDF.");
      return;
    }

    if (!paciente.trim()) {
      Alert.alert("Atenção", "Por favor, informe o nome do paciente.");
      return;
    }

    try {
      setLoading(true);

      // Tenta fazer upload do arquivo para o Supabase Storage (opcional)
      let fileUrl = file.uri || "";
      
      try {
        const fileExt = file.name?.split('.').pop() || 'pdf';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `manipulados/${fileName}`;

        if (file.uri) {
          const response = await fetch(file.uri);
          const blob = await response.blob();

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('manipulados')
            .upload(filePath, blob, {
              contentType: 'application/pdf',
              upsert: false
            });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('manipulados')
              .getPublicUrl(filePath);
            fileUrl = urlData.publicUrl;
          }
        }
      } catch (storageError: any) {
        // Se o storage não estiver configurado, usa a URI local
        console.warn("Storage não disponível, usando URI local:", storageError);
        fileUrl = file.uri || "";
      }

      // Cria o pedido de manipulados no banco de dados
      console.log("Criando pedido de manipulados...");
      const manipulado = await createManipulado({
        paciente: paciente.trim(),
        file_url: fileUrl,
        file_name: file.name || "receita.pdf",
      });

      console.log("Pedido criado com sucesso:", manipulado.id);

      // Redireciona para a tela de análise com o ID do manipulado criado
      router.replace({
        pathname: "/manipulados/analise",
        params: { id: manipulado.id },
      });
    } catch (error: any) {
      console.error("Erro ao enviar manipulado:", error);
      console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
      
      // Se o erro for sobre tabela não existir, mostra mensagem clara
      if (
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist") ||
        error.message?.includes("relation") ||
        error.message?.includes("table") ||
        error.code === "42P01"
      ) {
        Alert.alert(
          "Funcionalidade não configurada",
          "A tabela de manipulados não existe no banco de dados. Por favor, crie a tabela 'manipulados' no Supabase para usar esta funcionalidade.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            }
          ]
        );
      } else {
        Alert.alert(
          "Erro ao enviar pedido",
          error.message || "Não foi possível enviar o pedido. Tente novamente.",
          [
            {
              text: "OK",
              onPress: () => {},
            }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
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

      {/* Campo de nome do paciente */}
      <View style={estilos.inputContainer}>
        <Text style={estilos.inputLabel}>Nome do Paciente</Text>
        <TextInput
          style={estilos.input}
          placeholder="Digite o nome do paciente"
          placeholderTextColor={MUTED}
          value={paciente}
          onChangeText={setPaciente}
        />
      </View>

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
        style={[estilos.primaryBtn, (!file || !paciente.trim() || loading) && { opacity: 0.5 }]}
        activeOpacity={0.9}
        onPress={enviar}
        disabled={!file || !paciente.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.primaryTxt}>Enviar</Text>
        )}
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

  inputContainer: {
    marginTop: 18,
    marginHorizontal: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 8,
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
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
