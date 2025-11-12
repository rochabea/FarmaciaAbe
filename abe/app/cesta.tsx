import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export default function Cesta() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading, error, setQty, removeItem, total, refresh } = useCart();

  // Recarrega o carrinho quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refresh();
      }
    }, [refresh, user])
  );

  // Funções para alterar quantidade
  const aumentarQuantidade = async (itemId: string, qtyAtual: number) => {
    try {
      await setQty(itemId, qtyAtual + 1);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível atualizar a quantidade");
    }
  };

  const diminuirQuantidade = async (itemId: string, qtyAtual: number) => {
    try {
      if (qtyAtual > 1) {
        await setQty(itemId, qtyAtual - 1);
      } else {
        await removerItem(itemId);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível atualizar a quantidade");
    }
  };

  const removerItemDoCarrinho = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível remover o item");
    }
  };

  const calcularTotal = () => {
    return total.toFixed(2);
  };

  // Função para obter a imagem do produto
  const getProductImage = (imageUrl: string | null | undefined) => {
    if (imageUrl) {
      return { uri: imageUrl };
    }
    return require('../assets/images/remedio.png');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/home')}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Cesta</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Loading ou Erro */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#242760" />
          <Text style={styles.loadingText}>Carregando carrinho...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {error.includes("logado") || error.includes("autenticado") ? (
            <TouchableOpacity 
              onPress={() => router.push('/login')} 
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Fazer login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={refresh} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!user && !authLoading && !loading && !error && (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Você precisa estar logado para ver o carrinho</Text>
          <TouchableOpacity 
            onPress={() => router.push('/login')} 
            style={styles.continuarBtn}
          >
            <Text style={styles.continuarText}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Itens da cesta */}
      {!loading && !error && items.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <TouchableOpacity onPress={() => router.push('../(tabs)/home')} style={styles.continuarBtn}>
            <Text style={styles.continuarText}>Ver produtos</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          {/* Vendedor */}
          <View style={styles.vendedorRow}>
            <Text style={styles.vendidoPor}>Itens no carrinho</Text>
          </View>

          {/* Itens da cesta */}
          <View style={styles.cestaBox}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image 
                  source={getProductImage(item.image_url)} 
                  style={styles.itemImage} 
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.quantidadeRow}>
                    <TouchableOpacity onPress={() => diminuirQuantidade(item.id, item.qty)}>
                      <Text style={styles.qtdBtn}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantidade}>{item.qty}x</Text>
                    <TouchableOpacity onPress={() => aumentarQuantidade(item.id, item.qty)}>
                      <Text style={styles.qtdBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemPrice}>
                    R$ {((item.price || 0) * (item.qty || 0)).toFixed(2)}
                  </Text>
                  <Text style={styles.itemPriceUnit}>
                    R$ {(item.price || 0).toFixed(2)} cada
                  </Text>
                  <TouchableOpacity 
                    onPress={() => removerItemDoCarrinho(item.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Total */}
      {!loading && !error && items.length > 0 && (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.subtotalText}>Subtotal</Text>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
          </View>

          {/* Botão continuar */}
          <TouchableOpacity 
            style={styles.continuarBtn} 
            onPress={() => router.push(`/forma-entrega?subtotal=${calcularTotal()}`)}
          >
            <Text style={styles.continuarText}>Continuar</Text>
          </TouchableOpacity>
        </>
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
    fontSize: 28,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  sacolaIcon: {
    width: 70,
    height: 70,
  },
  vendedorRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vendidoPor: {
    fontSize: 15,
    color: '#242760',
    fontWeight: '700',
  },
  removerText: {
    color: '#000000ff',
    fontWeight: '700',
  },
  cestaBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  qtdBtn: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#242760',
    fontWeight: '700',
  },
  quantidade: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
  },
  itemPriceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 2,
  },
  totalBox: {
    width: '90%',
    marginTop: 10,
  },
  subtotalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginBottom: 5,
  },
  totalValor: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  continuarBtn: {
    backgroundColor: '#242760',
    width: '90%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#242760',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  removeButton: {
    marginTop: 4,
  },
  removeText: {
    fontSize: 12,
    color: '#EF4444',
    textDecorationLine: 'underline',
  },
});
