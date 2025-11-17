import React, { useCallback } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext"; // ajuste o caminho

export default function EntregadorLayout() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    await signOut();            // desloga no Supabase e zera contexto
    router.replace("/bemvindo"); // 👈 volta para sua tela de bem-vindo
  }, [signOut, router]);

  return (
    <Stack
      screenOptions={{
        // aqui você pode colocar um botão "Sair" no header
        // headerRight: () => (
        //   <Button title="Sair" onPress={handleSignOut} />
        // ),
        headerShown: false,
      }}
    />
  );
}
