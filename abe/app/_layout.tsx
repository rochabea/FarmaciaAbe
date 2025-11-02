import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

// IMPORTS COMO DEFAULT:
import CartaoProvider from "./parametros/CartaoContext";
import CartProvider from "./context/CartContext";

export { ErrorBoundary } from "expo-router";
export const unstable_settings = { initialRouteName: "(tabs)" };

export default function RootLayout() {
  const colorScheme = useColorScheme?.() ?? "light"; // protege caso o hook não exista

  return (
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
  );
}
