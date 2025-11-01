import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { router } from "expo-router";

export default function Politica() {
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
      <View style={estilos.header}>
        <TouchableOpacity onPress={() => router.push("/cesta")}>
          <Image source={require("../assets/images/car.png")} style={estilos.icon} />
        </TouchableOpacity>

        <Image source={require("../assets/images/logo.png")} style={estilos.logo} resizeMode="contain" />

        <TouchableOpacity onPress={() => router.push("/notificacao")}>
          <Image source={require("../assets/images/notificacao.png")} style={estilos.icon} />
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={estilos.scroll}>
        <Text style={estilos.titulo}>Política de privacidade</Text>

        <Text style={estilos.subtitulo}>Quais dados coletamos:</Text>
        <Text style={estilos.itemDestaque}>
          • Informações fornecidas: nome, email, telefone, data de nascimento e CPF.
        </Text>
        <Text style={estilos.itemDestaque}>• Informações automáticas: cookies, localização, uso do app.</Text>

        <Text style={estilos.subtitulo}>Como usamos os dados:</Text>
        <Text style={estilos.itemDestaque}>• Para oferecer serviços e funcionalidades do app.</Text>
        <Text style={estilos.itemDestaque}>• Para enviar promoções e notificações personalizadas.</Text>
        <Text style={estilos.itemDestaque}>• Para melhorar a experiência do usuário.</Text>

        <Text style={estilos.subtitulo}>Proteção e direitos:</Text>
        <Text style={estilos.itemDestaque}>• Dados criptografados e com acesso limitado.</Text>
        <Text style={estilos.itemDestaque}>• Usuário pode consultar, corrigir ou excluir seus dados.</Text>
        <Text style={estilos.itemDestaque}>• Alterações na política são notificadas dentro do app.</Text>

        {/* Checkbox customizado */}
        <View style={estilos.checkboxContainer}>
          <TouchableOpacity
            style={[estilos.checkbox, aceito && estilos.checkboxAtivo]}
            onPress={() => setAceito(!aceito)}
            activeOpacity={0.8}
          >
            {aceito && <Text style={estilos.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={estilos.label}>Eu aceito os termos</Text>
        </View>

        <Text style={estilos.consentimentoTitulo}>Consentimento:</Text>
        <View style={estilos.boxCinza}>
          <Text style={estilos.textoCinza}>O usuário deve aceitar a política para usar o app.</Text>
        </View>

        <TouchableOpacity
          style={[estilos.botao, { backgroundColor: aceito ? "#242760" : "#A0A0A0" }]}
          onPress={handleSalvar}
          activeOpacity={aceito ? 0.8 : 1}
        >
          <Text style={estilos.textoBotao}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: { 
    width: 34, 
    height: 34 
}, 
  logo: { 
    width: 100, 
    height: 40 
},

  scroll: {
     padding: 20, 
     paddingBottom: 60 
    },
  titulo: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#242760", 
    marginBottom: 15 
},
  subtitulo: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#000", 
    marginTop: 15, 
    marginBottom: 8 
},
  itemDestaque: { 
    fontSize: 15, 
    color: "#544C4C", 
    fontWeight: "700", 
    marginBottom: 5, 
    lineHeight: 22 
},

  checkboxContainer: {
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 20 
},
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#242760",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxAtivo: {
    backgroundColor: "#242760" 
},
  checkmark: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "bold" 
},
  label: { 
    fontSize: 15, 
    color: "#000",
     marginLeft: 8, 
     fontWeight: "600" 
    },

  consentimentoTitulo: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#000", 
    marginTop: 20, 
    marginBottom: 8 
},
  boxCinza: { 
    backgroundColor: "#F4F4F7", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 20 
},
  textoCinza: { 
    fontSize: 14, 
    color: "#544C4C" 
},
  botao: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: { 
    fontSize: 16, 
    fontWeight: "700",
     color: "#fff" 
    },
});
