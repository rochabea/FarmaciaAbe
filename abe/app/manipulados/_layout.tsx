import React from "react";
import { Stack } from "expo-router";

export default function ManipuladosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      { /* <Stack.Screen name="solicitacoes" />
      {/* próximas telas que você criar */}
      <Stack.Screen name="analise" />
      <Stack.Screen name="aprovados" />
      <Stack.Screen name="rejeitados" />
      <Stack.Screen name="detalhes" />
    </Stack>
  );
}
