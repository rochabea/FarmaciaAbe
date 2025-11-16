import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { fetchUserAddresses } from '../../lib/addresses';

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userAddress, setUserAddress] = useState<string>('Nenhum endereço cadastrado');
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Obtém o nome do usuário dos metadados ou email
  const getUserName = () => {
    if (!user) return 'Usuário';
    
    // Tenta obter o nome dos metadados
    const fullName = user.user_metadata?.full_name || 
                     user.user_metadata?.name ||
                     user.user_metadata?.nome;
    
    if (fullName) return fullName;
    
    // Se não tiver nome, usa o email sem o domínio
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Usuário';
  };

  const userName = getUserName();

  // Busca o endereço do usuário
  useEffect(() => {
    const loadAddress = async () => {
      if (!user) {
        setLoadingAddress(false);
        return;
      }

      try {
        setLoadingAddress(true);
        const addresses = await fetchUserAddresses();
        
        if (addresses && addresses.length > 0) {
          // Pega o primeiro endereço (ou o principal se houver)
          const address = addresses[0];
          const addressString = `${address.logradouro}, ${address.numero} - ${address.bairro}, ${address.cidade} - ${address.estado}`;
          setUserAddress(addressString);
        } else {
          setUserAddress('Nenhum endereço cadastrado');
        }
      } catch (error: any) {
        console.error('Erro ao carregar endereço:', error);
        setUserAddress('Erro ao carregar endereço');
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddress();
  }, [user]);

  // Lista de ações do perfil
  const actions = [
    { name: 'Editar Perfil', route: '/editar_perfil', iconLeft: require('../../assets/images/editarC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Meus Pedidos', route: '/sacola', iconLeft: require('../../assets/images/sacolaC.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Manipulados', route: '/manipulados/solicitacoes', iconLeft: require('../../assets/images/vitamina.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Privacidade', route: '/privacidade', iconLeft: require('../../assets/images/privacidade.png'), iconRight: require('../../assets/images/seta-direita.png') },
    { name: 'Configurações', route: '/configuracao', iconLeft: require('../../assets/images/configuracaoC.png'), iconRight: require('../../assets/images/seta-direita.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Topo azul arredondado */}
      <View style={styles.topRect}>
        <Text style={styles.topTitle}>Perfil</Text>

        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Notificação */}
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        {/* Foto de perfil */}
        <View style={styles.oval}>
          <Image source={require('../../assets/images/perfilfoto.png')} style={styles.profileImage} />
        </View>
      </View>

      {/* Nome e endereço */}
      {authLoading ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="small" color="#242760" />
        </View>
      ) : (
        <>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.addressContainer}>
            <Image source={require('../../assets/images/local.png')} style={styles.addressIcon} />
            {loadingAddress ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Text style={styles.userAddress}>{userAddress}</Text>
            )}
          </View>
        </>
      )}

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
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/sair')}>
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