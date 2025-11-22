import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function RotaEntrega() {
  const router = useRouter();

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ alignItems: "center" }}>
      
      {/* TOPO */}
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Rota</Text>

        <View style={estilos.circuloIcone}>
          <Image
            source={require("../../assets/images/local (2).png")}
            style={estilos.iconeCentral}
          />
        </View>
      </View>

      {/* CONTEÚDO */}
      <View style={estilos.conteudo}>
        <Text style={estilos.tituloSecao}>Detalhes do Pedido</Text>

        {/* MAPA */}
        <Image
          source={require("../../assets/images/mapa.png")}
          style={estilos.mapa}
        />

        <Text style={estilos.enderecoTitulo}>Endereço da entrega</Text>
        <Text style={estilos.enderecoTexto}>Av. Central, nº 450 - São Paulo/SP</Text>

        {/* BOTÃO */}
        <TouchableOpacity style={estilos.botaoConfirmar} onPress={() => router.push("/entregador/home")}>
          <Text style={estilos.textoConfirmar}>Confirmar entrega</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topo: {
    width: "100%",
    height: 200,
    backgroundColor: "#ACC852",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    position: "relative",
  },

  botaoVoltar: {
    position: "absolute",
    left: 20,
    top: 60,
  },

  iconeVoltar: {
    width: 32,
    height: 32,
    tintColor: "#fff",
  },

  tituloTopo: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 35,
  },

  circuloIcone: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -50,
  },

  iconeCentral: {
    width: 81,
    height: 81,
    tintColor: "#242760",
  },

  conteudo: {
    width: "85%",
    marginTop: 80,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242760",
    marginBottom: 10,
  },

  mapa: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    marginBottom: 15,
  },

  enderecoTitulo: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    color: "#242760",
  },

  enderecoTexto: {
    fontSize: 15,
    marginBottom: 20,
    color: "#000",
  },

  botaoConfirmar: {
    width: "100%",
    backgroundColor: "#ACC852",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  textoConfirmar: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
});
