import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


export default function Profile() {
  const router = useRouter();

  const userName = 'Ana Beatriz';
  const userAddress = 'Rua Exemplo, 123 - Cidade';
  const userImage = 'https://placekitten.com/200/200';

  // Cada ação tem seu próprio ícone à esquerda e à direita
  const actions = [
    { name: 'Editar Perfil', route: '/sacola', iconLeft: require('../../assets/images/editarC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Meus Pedidos', route: '/sacola', iconLeft: require('../../assets/images/sacolaC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Histórico', route: '/sacola', iconLeft: require('../../assets/images/historicoC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Privacidade', route: '/sacola', iconLeft: require('../../assets/images/privacidade.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Configurações', route: '/sacola', iconLeft: require('../../assets/images/configuracaoC.png'), iconRight: require('../../assets/images/seta-direita.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Topo com fundo azul */}
      <View style={styles.topRect}>
        <Text style={styles.topTitle}>Perfil</Text>
        <TouchableOpacity style={styles.notification}>
          <Image source={require('../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        {/* Círculo da foto de perfil */}
        <View style={styles.oval}>
          <Image source={{ uri: userImage }} style={styles.profileImage} />
        </View>
      </View>

      {/* Nome e endereço */}
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.userAddress}>{userAddress}</Text>

      {/* Caixa de ações */}
      <View style={styles.actionBox}>
        {actions.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.actionItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.actionContent}>
              <Image source={item.iconLeft} style={styles.actionIcon} />
              <Text style={styles.actionText}>{item.name}</Text>
              <Image source={item.iconRight} style={styles.actionArrow} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Sair */}
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
    height: 280,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 60,
  },

  topTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 50,
  },

  notification: {
    position: 'absolute',
    right: 20,
    top: 50,
  },

  notificationIcon: {
    width: 25,
    height: 25,
  },

  oval: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -60,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 70,
  },

  userAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
    color: '#242760',
  },

  actionArrow: {
    width: 20,
    height: 20,
    tintColor: '#242760',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
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