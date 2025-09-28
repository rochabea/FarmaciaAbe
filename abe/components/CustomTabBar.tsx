import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const NAVY = '#242760';
export const TAB_BAR_HEIGHT = 70;

export default function CustomTabBar() {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {/* Home */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
        <Image
          source={require('../assets/images/home.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Sacola */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/sacola')}>
        <Image
          source={require('../assets/images/sacola.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* FAB central */}
      <TouchableOpacity
        style={styles.fabWrapper}
        onPress={() => router.replace('/(tabs)/busca')}
      >
        <View style={styles.fab}>
          <Image
            source={require('../assets/images/buscar.png')}
            style={{ width: 34, height: 34 }}
          />
        </View>
      </TouchableOpacity>

      {/* Configuração */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/configuracao')}>
        <Image
          source={require('../assets/images/configuracao.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/conta')}>
        <Image
          source={require('../assets/images/perfil.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: NAVY,
  },
  fabWrapper: {
    marginTop: -20, // "sobe" a bolinha
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});
