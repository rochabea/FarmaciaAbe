import React from "react";
import {View,Text,TouchableOpacity,ScrollView,StyleSheet,Image,} from "react-native";
import { useRouter } from "expo-router";

export default function NotificacoesEntregador() {
  const router = useRouter();
  const notificacoes = [
    {
      id: "1",
      title: "Novo pedido disponível",
      message: "Você recebeu um novo pedido para retirada.",
      createdAt: "2025-11-21 14:35",
    },
    {
      id: "2",
      title: "Pedido cancelado",
      message: "Um cliente cancelou um pedido recentemente.",
      createdAt: "2025-11-21 13:10",
    },
    {
      id: "3",
      title: "Entrega concluída",
      message: "Entrega finalizada com sucesso! Bom trabalho.",
      createdAt: "2025-11-20 18:42",
    },
  ];

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Notificações</Text>

        <View style={styles.iconCircle}>
          <Image
            source={require("../../assets/images/notificacaoA.png")}
            style={styles.cartIcon}
          />
        </View>
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notificacoes.map((n) => (
          <View key={n.id} style={styles.box}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{n.title}</Text>
              <Text style={styles.texto}>{n.message}</Text>
              <Text style={styles.notificationDate}>{n.createdAt}</Text>
            </View>

            <View style={styles.removeButton}>
              <Text style={styles.removerText}>Remover</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topRect: {
    width: "100%",
    height: 180,
    backgroundColor: "#ACC852",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: 50,
  },

  topTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -60,
    borderWidth: 4,
    borderColor: "#fff",
  },

  cartIcon: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },

  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E9E9F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start",
    minHeight: 80,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242760",
    marginBottom: 6,
  },

  texto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242760",
    marginBottom: 6,
    lineHeight: 20,
  },

  notificationDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  removeButton: {
    padding: 4,
    justifyContent: "center",
  },

  removerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
});
