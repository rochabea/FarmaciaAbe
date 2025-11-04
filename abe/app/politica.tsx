// app/politica.tsx (ajuste o caminho se usar outra pasta)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const NAVY = "#242760";
const GRAY = "#544C4C";

export default function Politica() {
  const router = useRouter();
  const [aceito, setAceito] = useState(false);

  const handleSalvar = () => {
    if (aceito) {
      Alert.alert("Sucesso", "As alterações foram salvas!");
      router.push("/privacidade");
    } else {
      Alert.alert("Aviso", "Você deve aceitar a política para usar o app.");
    }
  };

  return (
    <View style={estilos.container}>
      {/* HEADER igual ao modelo */}
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image
            source={require("../assets/images/seta-esquerda.png")}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoNotificacao}
          onPress={() => router.push("/notificacao")}
        >
          <Image
            source={require("../assets/images/notificacao.png")}
            style={estilos.iconeNotificacao}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Política de privacidade</Text>

        {/* círculo/ícone central sobreposto (opcional: troque a imagem se quiser outra) */}
        <View style={estilos.circuloIcone}>
          <Image
            source={require("../assets/images/privacidade.png")}
            style={estilos.iconeCentral}
          />
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.subtitulo}>Quais dados coletamos:</Text>
        <Text style={estilos.itemDestaque}>
          • Informações fornecidas: nome, email, telefone, data de nascimento e CPF.
        </Text>
        <Text style={estilos.itemDestaque}>
          • Informações automáticas: cookies, localização, uso do app.
        </Text>

        <Text style={estilos.subtitulo}>Como usamos os dados:</Text>
        <Text style={estilos.itemDestaque}>• Para oferecer serviços e funcionalidades do app.</Text>
        <Text style={estilos.itemDestaque}>• Para enviar promoções e notificações personalizadas.</Text>
        <Text style={estilos.itemDestaque}>• Para melhorar a experiência do usuário.</Text>

        <Text style={estilos.subtitulo}>Proteção e direitos:</Text>
        <Text style={estilos.itemDestaque}>• Dados criptografados e com acesso limitado.</Text>
        <Text style={estilos.itemDestaque}>• Usuário pode consultar, corrigir ou excluir seus dados.</Text>
        <Text style={estilos.itemDestaque}>
          • Alterações na política são notificadas dentro do app.
        </Text>

        {/* Checkbox */}
        <View style={estilos.checkboxContainer}>
          <TouchableOpacity
            style={[estilos.checkbox, aceito && estilos.checkboxAtivo]}
            onPress={() => setAceito((v) => !v)}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceito }}
          >
            {aceito && <Text style={estilos.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={estilos.label}>Eu aceito os termos</Text>
        </View>

        <Text style={estilos.consentimentoTitulo}>Consentimento:</Text>
        <View style={estilos.boxCinza}>
          <Text style={estilos.textoCinza}>
            O usuário deve aceitar a política para usar o app.
          </Text>
        </View>

        <TouchableOpacity
          style={[estilos.botao, { backgroundColor: aceito ? NAVY : "#A0A0A0" }]}
          onPress={handleSalvar}
          activeOpacity={aceito ? 0.85 : 1}
        >
          <Text style={estilos.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
  iconeCentral: {
    width: 81,
    height: 81,
    resizeMode: "contain",
    tintColor: NAVY,
  },

  // ===== CONTEÚDO =====
  conteudo: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 40 },
  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 15,
    marginBottom: 8,
  },
  itemDestaque: {
    fontSize: 15,
    color: GRAY,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 22,
  },

  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxAtivo: { backgroundColor: NAVY },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  label: { fontSize: 15, color: "#000", marginLeft: 8, fontWeight: "600" },

  consentimentoTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 18,
    marginBottom: 8,
  },
  boxCinza: {
    backgroundColor: "#F4F4F7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  textoCinza: { fontSize: 14, color: GRAY },

  botao: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
