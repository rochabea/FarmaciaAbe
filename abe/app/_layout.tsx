import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

// IMPORTS COMO DEFAULT:
import CartaoProvider from "./parametros/CartaoContext";
import CartProvider from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export { ErrorBoundary } from "expo-router";
// Removido initialRouteName para permitir que o index.tsx controle a navegação inicial

export default function RootLayout() {
  const colorScheme = useColorScheme?.() ?? "light"; // protege caso o hook não exista

  return (
    <AuthProvider>
      <CartaoProvider>
        <CartProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#FFFFFF" },
              }}
            >
              <Stack.Screen name="(tabs)" />
            </Stack>
          </ThemeProvider>
        </CartProvider>
      </CartaoProvider>
    </AuthProvider>
  );
}
