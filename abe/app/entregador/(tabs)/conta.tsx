import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const userName = 'Tom Jerry';
  const userAddress = 'Rua Exemplo, 123 - Cidade';

  // Lista de ações do perfil
  const actions = [
    { name: 'Editar Perfil', route: '../editar_ent', iconLeft: require('../../../assets/images/editarC.png'), iconRight: require('../../../assets/images/seta-direita.png') },
    { name: 'Minhas entregas', route: '/entregador/confirma', iconLeft: require('../../../assets/images/moto.png'), iconRight: require('../../../assets/images/seta-direita.png') },
    { name: 'Veículo', route: '../veiculo', iconLeft: require('../../../assets/images/carro.png'), iconRight: require('../../../assets/images/seta-direita.png') },
    { name: 'Privacidade', route: '../privacidade_ent', iconLeft: require('../../../assets/images/privacidade.png'), iconRight: require('../../../assets/images/seta-direita.png') },
    { name: 'Configurações', route: '/entregador/configuracao', iconLeft: require('../../../assets/images/configuracaoC.png'), iconRight: require('../../../assets/images/seta-direita.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRect}>
        <Text style={styles.topTitle}>Perfil</Text>

        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Notificação */}
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/entregador/notificacao_ent")}>
          <Image source={require('../../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        {/* Foto de perfil */}
        <View style={styles.oval}>
          <Image source={require('../../../assets/images/perfilfoto.png')} style={styles.profileImage} />
        </View>
      </View>

      {/* Nome e endereço */}
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.addressContainer}>
        <Image source={require('../../../assets/images/local.png')} style={styles.addressIcon} />
        <Text style={styles.userAddress}>{userAddress}</Text>
      </View>

      {/* Lista de ações */}
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

      {/* Botão sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/entregador/sair_ent')}>
        <Image source={require('../../../assets/images/sair.png')} style={styles.logoutIcon} />
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
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 80,
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
    width: 30,
    height: 30,
  },

  oval: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -50,
    borderWidth: 3,
    borderColor: '#ffffffff',
  },

  profileImage: {
    width: 138,
    height: 138,
    borderRadius: 69,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: -10,
  },

  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  addressIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },

  userAddress: {
    fontSize: 14,
    color: '#666',
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
    tintColor: '#544C4Cff',
  },

  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
  },

  actionArrow: {
    width: 20,
    height: 20,
    tintColor: '#544C4Cff',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    height: 50,
    backgroundColor: '#ACC852',
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