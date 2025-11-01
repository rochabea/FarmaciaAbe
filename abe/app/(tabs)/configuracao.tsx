import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Configuracoes() {
  const router = useRouter();

  // Lista de ações da tela de configurações
  const actions = [
    { name: 'Gerenciar Perfil', route: '/conta', iconLeft: require('../../assets/images/perfilconf.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Segurança', route: '/seguranca', iconLeft: require('../../assets/images/seguranca.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Endereço', route: '/localizacoes', iconLeft: require('../../assets/images/local.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Cartões', route: '/cartoes', iconLeft: require('../../assets/images/cartaoC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Excluir Conta', route: '/excluir_conta', iconLeft: require('../../assets/images/excluir.png'), iconRight: require('../../assets/images/seta-direita.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Configurações</Text>

        <TouchableOpacity style={styles.notification}>
          <Image source={require('../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../../assets/images/configuracaoA.png')} style={styles.configuracoesIcon} />
        </View>
      </View>
      <View style={{ height: 80 }} />

      <View style={styles.actionBox}>
        {actions.map((item) => (
          <TouchableOpacity key={item.name} style={styles.actionItem} onPress={() => router.push(item.route as any)}>
            <View style={styles.actionContent}>
              <Image source={item.iconLeft} style={styles.actionIcon} />
              <Text style={styles.actionText}>{item.name}</Text>
              <Image source={item.iconRight} style={styles.actionArrow} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/bemvindo')}>
        <Image source={require('../../assets/images/sair.png')} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 40,
  },

  topRect: {
    width: '100%',
    height: 250,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },

  topTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 90,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 98,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  notification: {
    position: 'absolute',
    right: 20,
    top: 92,
  },

  notificationIcon: {
    width: 25,
    height: 25,
  },

  iconCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -72, 
    borderWidth: 3,
    borderColor: '#ffffffff',
  },

  configuracoesIcon: {
    width: 80,
    height: 80,
  },

  actionBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    marginBottom: 30,
  },

  actionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  actionArrow: {
    width: 20,
    height: 20,
    tintColor: '#544C4C',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    height: 50,
    backgroundColor: '#242760',
    borderRadius: 12,
    justifyContent: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },

  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
