import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { CartaoProvider } from './parametros/CartaoContext';
import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartaoProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Grupo de tabs */}
            <Stack.Screen name="(tabs)" />

            {/* Suas rotas de página “normais” */}
            <Stack.Screen name="medicamentos" />

            
            <Stack.Screen
              name="modals"
              options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </CartaoProvider>
  );
}
