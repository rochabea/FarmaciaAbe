import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function HomeEntregador() {
  const router = useRouter();

  // Dados simulados para o scatter plot (0-100 escala)
  const scatterData = [
    { x: 10, y: 20, type: "Concluídas", color: "#6BCB77" },
    { x: 50, y: 40, type: "Concluídas", color: "#6BCB77" },
    { x: 90, y: 30, type: "Concluídas", color: "#6BCB77" },
    { x: 30, y: 60, type: "Pendentes", color: "#FFD93D" },
    { x: 70, y: 80, type: "Pendentes", color: "#FFD93D" },
    { x: 110, y: 50, type: "Pendentes", color: "#FFD93D" },
    { x: 60, y: 90, type: "Atrasadas", color: "#FF6B6B" },
    { x: 100, y: 110, type: "Atrasadas", color: "#FF6B6B" },
  ];

  const GRAPH_WIDTH = 300;
  const GRAPH_HEIGHT = 150;

  // Converte valores (0-100 escala) para posição dentro do gráfico
  const convertX = (x: number) => (x / 120) * GRAPH_WIDTH;
  const convertY = (y: number) => GRAPH_HEIGHT - (y / 120) * GRAPH_HEIGHT;

  // Linhas de grade
  const yGridLines = [0, 25, 50, 75, 100];
  const xGridLines = [0, 25, 50, 75, 100];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Filtro")}>
          <Image source={require("../../../assets/images/filtro.png")} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require("../../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => router.push("/notificacao")}>
          <Image source={require("../../../assets/images/notificacao.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Status das Entregas */}
        <View style={styles.dadosBox}>
          <Text style={styles.sectionTitle}>Status das Entregas</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            
            {/* Números do eixo Y */}
            <View style={{ justifyContent: "space-between", height: GRAPH_HEIGHT + 40 }}>
              {yGridLines
                .slice()
                .reverse()
                .map((val) => (
                  <Text key={`y-label-${val}`} style={styles.axisLabelY}>
                    {val}
                  </Text>
                ))}
            </View>

            {/* Gráfico */}
            <View style={[styles.scatterPlot, { width: GRAPH_WIDTH, height: GRAPH_HEIGHT }]}>
              {/* Linhas horizontais (Y grid) */}
              {yGridLines.map((val, i) => (
                <View
                  key={`y-${i}`}
                  style={{
                    position: "absolute",
                    top: convertY(val),
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: "#ddd",
                  }}
                />
              ))}

              {/* Linhas verticais (X grid) */}
              {xGridLines.map((val, i) => (
                <View
                  key={`x-${i}`}
                  style={{
                    position: "absolute",
                    left: convertX(val),
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: "#ddd",
                  }}
                />
              ))}

              {/* Pontos */}
              {scatterData.map((p, i) => (
                <View
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: p.color,
                    position: "absolute",
                    left: convertX(p.x) - 6,
                    top: convertY(p.y) - 6,
                  }}
                />
              ))}

              {/* Números do eixo X */}
              <View style={styles.axisXLabels}>
                {xGridLines.map((val, i) => (
                  <Text key={`x-label-${i}`} style={styles.axisLabelX}>
                    {val}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Legenda */}
          <View style={styles.legend}>
            {["Concluídas", "Pendentes", "Atrasadas"].map((type) => {
              const color = scatterData.find((p) => p.type === type)?.color || "#000";
              return (
                <View key={type} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: color }]} />
                  <Text style={styles.legendText}>{type}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Status boxes */}
        <View style={styles.statusBoxes}>
          <View style={[styles.statusBox, { backgroundColor: "#6BCB77" }]}>
            <Text style={styles.statusNumber}>12</Text>
            <Text style={styles.statusLabel}>Concluídas</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: "#FFD93D" }]}>
            <Text style={styles.statusNumber}>3</Text>
            <Text style={styles.statusLabel}>Pendentes</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: "#FF6B6B" }]}>
            <Text style={styles.statusNumber}>1</Text>
            <Text style={styles.statusLabel}>Atrasadas</Text>
          </View>
        </View>

        {/* Pedido ativo */}
        <View style={styles.pedidoBox}>
          <Text style={styles.pedidoTitle}>Pedido #12345</Text>
          <Text style={styles.endereco}>Rua das Flores, 123 - Bairro Jardim, São Paulo/SP</Text>

          <TouchableOpacity style={styles.btnAceitar}>
            <Text style={styles.btnText}>Aceitar nova entrega</Text>
          </TouchableOpacity>

          {/* Ações com ícones grandes */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Image source={require("../../../assets/images/seguro.png")} style={styles.actionIcon} />
              <Text style={styles.actionText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Image source={require("../../../assets/images/rota.png")} style={styles.actionIcon} />
              <Text style={styles.actionText}>Rota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Image source={require("../../../assets/images/problema.png")} style={styles.actionIcon} />
              <Text style={styles.actionText}>Problema</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  icon: { width: 30, height: 30 },
  logo: { width: 100, height: 40 },
  dadosBox: { margin: 20, backgroundColor: "#DDEEFF", borderRadius: 12, padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#242760", marginBottom: 10 },
  scatterPlot: {
    backgroundColor: "#fff",
    borderRadius: 12,
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 5,
  },
    axisLabelY: { fontSize: 10, color: "#242760", marginBottom: 10, fontWeight: "700" },
  axisLabelX: { fontSize: 10, color: "#242760", textAlign: "center", fontWeight: "700" },
  axisXLabels: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legend: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 5 },
  legendText: { fontSize: 12, color: "#242760" },
  statusBoxes: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 15 },
  statusBox: { flex: 1, height: 80, borderRadius: 12, alignItems: "center", justifyContent: "center", marginHorizontal: 5 },
  statusNumber: { fontSize: 20, fontWeight: "700", color: "#fff" },
  statusLabel: { fontSize: 12, color: "#fff", marginTop: 5, textAlign: "center" },
  pedidoBox: { margin: 20, padding: 15, borderRadius: 12, backgroundColor: "#F4F4F7" },
  pedidoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 5 },
  endereco: { fontSize: 14, color: "#000", marginBottom: 15 },
  btnAceitar: { backgroundColor: "#A7D129", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  btnText: { color: "#fff", fontWeight: "700" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { flex: 1, backgroundColor: "#A7D129", padding: 10, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  actionText: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 5 },
  actionIcon: { width: 43, height: 43 },
});
