import React, { useState } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Image,Modal,TextInput,FlatList,} from "react-native";
import { useRouter } from "expo-router";

export default function ReportarProblema() {
  const router = useRouter();

  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalhesProblema, setDetalhesProblema] = useState("");

  const options = [
    "João da Silva",
    "Maria Souza",
    "Carlos Oliveira",
    "Ana Martins",
    "Farmácia",
    "Outro",
  ];

  const handleSelectClient = (client: string) => {
    setSelectedClient(client);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => router.push("/entregador/notificacao_ent")}>
          <Image source={require("../../assets/images/notificacao.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Selecione o cliente ou tipo de problema</Text>
        <Text style={styles.description}>
          Abaixo aparecerão os clientes que você teve contato. Caso o problema não seja com um
          cliente, selecione “Farmácia” ou outra opção.
        </Text>

        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.clientCard} onPress={() => handleSelectClient(item)}>
              <Text style={styles.clientName}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Relatar Problema - {selectedClient}</Text>

            <Text style={styles.label}>Detalhes do Problema</Text>
            <TextInput
              style={styles.input}
              value={detalhesProblema}
              onChangeText={setDetalhesProblema}
              multiline
              placeholder="Descreva o problema..."
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log(`Problema de ${selectedClient}: ${detalhesProblema}`);
                setModalVisible(false);
                setDetalhesProblema("");
              }}
            >
              <Text style={styles.buttonText}>Enviar Reclamação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  backIcon: { 
    width: 25, 
    height: 25, 
    tintColor: "#000" 
  },
  icon: { 
    width: 30, 
    height: 30 
  },
  logo: { 
    width: 150, 
    height: 60 
  },

  scrollContainer: { paddingHorizontal: 20 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242760",
    marginBottom: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    fontWeight: "700",
    color: "#544C4C",
    marginBottom: 15,
    textAlign: "center",
  },

  clientCard: {
    backgroundColor: "#F4F4F4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  clientName: { 
    color: "#000", 
    fontSize: 16, 
    fontWeight: "600" 
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 15, 
    color: "#000" 
  },
  label: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#ACC852", 
    marginBottom: 5 
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
    color: "#000",
  },
  button: {
    backgroundColor: "#ACC852",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  },
});
