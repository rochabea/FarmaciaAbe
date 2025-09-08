import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          height: 80,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
        },
      }}
    >
      {/* 1ª aba: Início */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                <FontAwesome
                  name="info-circle"
                  size={24}
                  color={Colors[colorScheme ?? 'light'].text}
                />
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* 2ª aba: Sacola */}
      <Tabs.Screen
        name="sacola"
        options={{
          title: 'Sacola',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        }}
      />

      {/* 3ª aba: Busca (botão central com estado ativo) */}
      {/* 3ª aba: Busca (botão central elevado) */}
    <Tabs.Screen
      name="busca"
      options={{
        title: 'Busca',
        tabBarIcon: ({ color, focused }) => (
          <View style={styles.fabWrapper}>
            <View style={[styles.fab, focused && styles.fabActive]}>
              <FontAwesome name="search" size={28} color={focused ? Colors.light.tint : '#fff'} />
            </View>
          </View>
        ),
      }}
    />


      {/* 4ª aba: Favoritos */}
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />

      {/* 5ª aba: Conta */}
      <Tabs.Screen
        name="conta"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    top: -15,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8A8A8A',
    alignItems: 'center',
    justifyContent: 'center',
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // sombra Android
    elevation: 8,
  },
  fabActive: {
    backgroundColor: '#E3F2FD',
  },
});
