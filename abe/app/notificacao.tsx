import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { generateNotifications, type Notification } from '../lib/notifications';

export default function NotificacoesCliente() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const notifications = await generateNotifications();
      setNotificacoes(notifications);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error);
      setNotificacoes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carrega notificações quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const removerNotificacao = (id: string) => {
    setNotificacoes(notificacoes.filter(n => n.id !== id));
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification.actionUrl) {
      if (notification.actionParams) {
        router.push({
          pathname: notification.actionUrl as any,
          params: notification.actionParams,
        });
      } else {
        router.push(notification.actionUrl as any);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Notificações</Text>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/notificacaoA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading || authLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#242760" />
            <Text style={styles.loadingText}>Carregando notificações...</Text>
          </View>
        ) : notificacoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>
              Você não possui notificações no momento
            </Text>
          </View>
        ) : (
          notificacoes.map(n => (
            <TouchableOpacity
              key={n.id}
              style={styles.box}
              onPress={() => handleNotificationPress(n)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{n.title}</Text>
                <Text style={styles.texto}>{n.message}</Text>
                <Text style={styles.notificationDate}>
                  {new Date(n.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  removerNotificacao(n.id);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removerText}>Remover</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex:1, 
    backgroundColor:'#fff'
},
  topRect:{
    width:'100%', 
    height:180, 
    backgroundColor:'#242760', 
    borderBottomLeftRadius:80, 
    borderBottomRightRadius:80,
    alignItems:'center', 
    justifyContent:'flex-start', 
    position:'relative', 
    paddingTop:50
  },
  topTitle:{color:'#fff', 
    fontSize:24, 
    fontWeight:'700', 
    marginTop:20
},
  backButton:{ 
    position:'absolute', 
    left:20, 
    top:50
},
  backIcon:{
    width:25, 
    height:25
},
  iconCircle:{
    width:120,
    height:120,
    borderRadius:60,
    backgroundColor:'#fff', 
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:-60,
    borderWidth:4,
    borderColor:'#fff',
  },
  cartIcon:{ 
    width:75, 
    height:75, 
    resizeMode:'contain'
},
  scrollContainer:{ 
    paddingTop:80, 
    paddingHorizontal:20, 
    paddingBottom:40 
},
  box:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#E9E9F5',
    borderRadius:12,
    padding:15,
    marginBottom:15,
    alignItems:'flex-start',
    minHeight: 80,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 6,
  },
  texto:{ 
    fontSize:14, 
    fontWeight:'500', 
    color: '#242760',
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
  removerText:{ 
    fontSize:12, 
    fontWeight:'700', 
    color:'#000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
