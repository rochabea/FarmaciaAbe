import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
// import CustomTabBar from '@/components/CustomTabBar'; // use se quiser

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
        },
      }}
      // Se for usar sua tab bar custom:
      // tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* 1ª aba: Home (app/(tabs)/home.tsx) */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/home.png')}
              style={[styles.icon, focused && { tintColor: '#242760' }]}
            />
          ),
        }}
      />

      {/* 2ª aba: Sacola (app/(tabs)/sacola.tsx) */}
      <Tabs.Screen
        name="sacola"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/sacola.png')}
              style={[styles.icon, focused && { tintColor: '#242760' }]}
            />
          ),
        }}
      />

      {/* 3ª aba: Buscar (app/(tabs)/busca.tsx) */}
      <Tabs.Screen
        name="busca"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabWrapper}>
              <View style={[styles.fab, focused && styles.fabActive]}>
                <Image
                  source={require('../../assets/images/buscar.png')}
                  style={{ width: 34, height: 34 }}
                />
              </View>
            </View>
          ),
        }}
      />

      {/* 4ª aba: Configuração (app/(tabs)/configuracao.tsx) */}
      <Tabs.Screen
        name="configuracao"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/configuracao.png')}
              style={[styles.icon, focused && { tintColor: '#242760' }]}
            />
          ),
        }}
      />

      {/* 5ª aba: Perfil (app/(tabs)/conta.tsx) */}
      <Tabs.Screen
        name="conta"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/perfil.png')}
              style={[styles.icon, focused && { tintColor: '#242760' }]}
            />
          ),
        }}
      />

      {/* Tela de Produto (app/(tabs)/produto/tela_produto.tsx) */}
      <Tabs.Screen name="produto/tela_produto" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { width: 30, height: 30 },
  fabWrapper: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#242760',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabActive: { backgroundColor: '#000000ff' },
});
