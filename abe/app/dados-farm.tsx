import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export default function ResumoRetirada() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items, loading, total } = useCart();
  const { user } = useAuth();

  const farmaciaNome = params.farmacia ? decodeURIComponent(params.farmacia as string) : '';
  const farmaciaKm = params.km ? params.km : '0 km';

  // Função para obter a imagem do produto
  const getProductImage = (imageUrl: string | null | undefined) => {
    if (imageUrl) {
      return { uri: imageUrl };
    }
    return require('../assets/images/remedio.png');
  };

  const calcularTotal = () => {
    return total.toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Resumo da Retirada</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />
      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Farmácia para retirada:</Text>
      </View>

      {/* Dados da farmácia e produtos */}
      <View style={styles.caixaFarmacia}>
        <View style={styles.farmaciaHeader}>
          <Image source={require('../assets/images/retirada.png')} style={styles.iconeFarmacia} />
          <Text style={styles.farmaciaNome}>{farmaciaNome} - {farmaciaKm}</Text>
        </View>

        {/* Retirado por */}
        <View style={styles.retiradoPorRow}>
          <Text style={styles.retiradoPorLabel}>Retirado por:</Text>
          <Text style={styles.usuarioNome}>
            {user?.user_metadata?.full_name || 
             user?.user_metadata?.name || 
             user?.user_metadata?.nome || 
             user?.email?.split('@')[0] || 
             'Usuário'}
          </Text>
        </View>

        {/* Produtos */}
        {loading ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#242760" />
            <Text style={{ marginTop: 10, color: '#666' }}>Carregando produtos...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>Nenhum produto no carrinho</Text>
          </View>
        ) : (
          <>
            <Text style={styles.produtosLabel}>Produtos:</Text>
            {items.map((item) => (
              <View key={item.id} style={[
                styles.itemRow,
                item.requires_prescription && styles.itemRowWithPrescription
              ]}>
                <Image 
                  source={getProductImage(item.image_url)} 
                  style={styles.itemImage} 
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.requires_prescription && (
                      <View style={styles.prescriptionBadge}>
                        <Text style={styles.prescriptionBadgeText}>RX</Text>
                      </View>
                    )}
                  </View>
                  {item.requires_prescription && (
                    <View style={styles.prescriptionAlertBox}>
                      <Text style={styles.prescriptionAlert}>
                        ⚠ Necessário enviar receita médica
                      </Text>
                    </View>
                  )}
                  <Text style={styles.itemQuantidade}>{item.qty}x</Text>
                </View>
                <Text style={styles.itemPrice}>R$ {((item.price || 0) * (item.qty || 0)).toFixed(2)}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Subtotal e Total */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
      </View>

      {/* Botão Confirmar Retirada */}
      <TouchableOpacity 
        style={[styles.continuarBtn, (loading || items.length === 0) && { opacity: 0.5 }]} 
        disabled={loading || items.length === 0}
        onPress={() => {
          router.push({
            pathname: '/opcao-pagamentoR',
            params: {
              subtotal: calcularTotal(),
              farmacia: encodeURIComponent(farmaciaNome),
              km: farmaciaKm,
            },
          });
        }}
      >
        <Text style={styles.continuarText}>Confirmar Retirada</Text>
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
  linhaTitulo: {
    width: '90%',
    marginBottom: 20,
  },
  tituloEntrega: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
  },
  caixaFarmacia: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  farmaciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconeFarmacia: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  farmaciaNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  retiradoPorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  retiradoPorLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginRight: 5,
  },
  usuarioNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760', 
  },
  produtosLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemRowWithPrescription: {
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
    paddingLeft: 12,
    marginLeft: -12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  prescriptionBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  prescriptionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  prescriptionAlertBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  prescriptionAlert: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  itemQuantidade: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
  },
  totalBox: {
    width: '90%',
    marginBottom: 30,
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
  },
  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
