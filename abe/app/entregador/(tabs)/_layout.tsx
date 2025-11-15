import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";

export default function TabLayoutEntregador() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
        },
      }}
    >
      {/* Home do entregador */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/home.png")}
              style={[styles.icon, focused && { tintColor: "#ACC852" }]}
            />
          ),
        }}
      />

      {/* Pedidos */}
      <Tabs.Screen
        name="confirma"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/sacola.png")}
              style={[styles.icon, focused && { tintColor: "#ACC852" }]}
            />
          ),
        }}
      />

      {/* Busca (FAB) */}
      <Tabs.Screen
        name="busca"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabWrapper}>
              <View style={[styles.fab, focused && styles.fabActive]}>
                <Image
                  source={require("../../../assets/images/buscar.png")}
                  style={{ width: 34, height: 34 }}
                />
              </View>
            </View>
          ),
        }}
      />

      {/* Configuração */}
      <Tabs.Screen
        name="configuracao"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/configuracao.png")}
              style={[styles.icon, focused && { tintColor: "#ACC852" }]}
            />
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="conta"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/images/perfil.png")}
              style={[styles.icon, focused && { tintColor: "#ACC852" }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { width: 30, height: 30 },
  fabWrapper: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ACC852",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  fabActive: { backgroundColor: "#000000ff" },
});
