import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { fetchUserOrders, formatDate, type Order } from '../../lib/orders';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const router = useRouter();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar pedidos
  const loadOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orders = await fetchUserOrders();
      setPedidos(orders);
    } catch (err: any) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Recarrega quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  // Função para obter a imagem do produto
  const getProductImage = (imageUrl: string | null | undefined) => {
    if (imageUrl) {
      return { uri: imageUrl };
    }
    return require('../../assets/images/remedio.png');
  };

  // Função para calcular o total do pedido
  const calcularTotal = (order: Order) => {
    if (order.total_cents !== null && order.total_cents !== undefined) {
      return (order.total_cents / 100).toFixed(2);
    }
    // Se não tiver total_cents, calcula a partir dos itens
    const total = order.order_items.reduce((sum, item) => {
      const price = item.products?.price_cents || 0;
      return sum + (price / 100) * item.quantity;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Meus Pedidos</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../../assets/images/sacolaA.png')} style={styles.sacolaIcon} />
        </View>
      </View>
      <View style={{ height: 80 }} />

      {/* Estado de carregamento */}
      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#242760" />
          <Text style={{ marginTop: 10, color: '#666' }}>Carregando pedidos...</Text>
        </View>
      ) : error ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: 'crimson', fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>
            Erro ao carregar pedidos
          </Text>
          <Text style={{ color: '#666', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadOrders}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : !user ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Faça login para ver seus pedidos
          </Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Você ainda não possui pedidos
          </Text>
        </View>
      ) : (
        /* Lista de pedidos */
        pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.pedidoBox}>
            <Text style={styles.retiradoText}>
              Pedido em {formatDate(pedido.created_at)}
            </Text>
            {pedido.status && (
              <Text style={styles.statusText}>Status: {pedido.status}</Text>
            )}
            <View style={styles.itensBox}>
              {pedido.order_items.map((item, index) => (
                <View key={item.id || index} style={styles.itemRow}>
                  <Image 
                    source={getProductImage(item.products?.image_url)} 
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.products?.name || 'Produto sem nome'}</Text>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    R$ {item.products?.price_cents 
                      ? ((item.products.price_cents / 100) * item.quantity).toFixed(2)
                      : '0.00'}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalValor}>R$ {calcularTotal(pedido)}</Text>
            </View>
          </View>
        ))
      )}
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

  sacolaIcon: {
    width: 80,
    height: 80,
  },

  pedidoBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },

  retiradoText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#242760',
  },

  itensBox: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 10,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  itemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  itemName: {
    flex: 1,
    fontSize: 16,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 5,
  },

  totalValor: {
    fontSize: 16,
    fontWeight: '700',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },

  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  retryButton: {
    backgroundColor: '#242760',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
