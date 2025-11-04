// app/(tabs)/_layout.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";

const NAVY = "#242760";       // ícone ativo
const INACTIVE = "#C9CDD7";   // ícones inativos

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        // >>> só ícones mudam de cor
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: INACTIVE,

        // >>> barra sempre branca
        tabBarStyle: {
          height: 70,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => <View style={{ flex: 1, backgroundColor: "#fff" }} />,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={[styles.icon, { tintColor: color }]}  // <- só o ícone recebe a cor
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sacola"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/sacola.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="busca"
        options={{
          // FAB central azul (ícone branco). A cor dos outros ícones continua vindo via "color".
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabWrapper} pointerEvents="none">
              <View style={[styles.fab, { backgroundColor: NAVY, opacity: focused ? 1 : 0.95 }]}>
                <Image
                  source={require("../../assets/images/buscar.png")}
                  style={{ width: 34, height: 34, tintColor: "#fff" }}
                />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="configuracao"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/configuracao.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="conta"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/perfil.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      {/* Telas fora da tab bar */}
      <Tabs.Screen name="produto/tela_produto" options={{ href: null }} />
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});
