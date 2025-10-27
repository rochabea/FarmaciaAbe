import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Pagamento() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [subtotalValor, setSubtotalValor] = useState(0);
  const [metodoSelecionado, setMetodoSelecionado] = useState<'pix' | 'credito' | null>(null);

  useEffect(() => {
    if (params?.subtotal) {
      const valorConvertido = parseFloat(String(params.subtotal));
      if (!isNaN(valorConvertido)) {
        setSubtotalValor(valorConvertido);
      }
    }
  }, [params]);

  const handleContinuar = () => {
    if (!metodoSelecionado) return;

    const pathname = metodoSelecionado === 'pix' ? '/pixE' : '/creditoE';
    router.push({ pathname, params: { subtotal: subtotalValor.toFixed(2) } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Pagamento</Text>

        <TouchableOpacity style={styles.notification}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Título */}
      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Como deseja pagar?</Text>
      </View>

      {/* Métodos de Pagamento */}
      <View style={styles.metodosContainer}>
        <TouchableOpacity
          style={[styles.metodoBox, metodoSelecionado === 'pix' && styles.metodoSelecionado]}
          onPress={() => setMetodoSelecionado('pix')}
        >
          <Image source={require('../assets/images/pix.png')} style={styles.metodoIcon} />
          <Text style={styles.metodoText}>Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metodoBox, metodoSelecionado === 'credito' && styles.metodoSelecionado]}
          onPress={() => setMetodoSelecionado('credito')}
        >
          <Image source={require('../assets/images/cartao-de-credito.png')} style={styles.metodoIcon} />
          <Text style={styles.metodoText}>Crédito</Text>
        </TouchableOpacity>
      </View>

      {/* Subtotal */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>R$ {subtotalValor.toFixed(2)}</Text>
      </View>

      {/* Botão Continuar */}
      <TouchableOpacity
        style={[styles.continuarBtn, { opacity: metodoSelecionado ? 1 : 0.6 }]}
        disabled={!metodoSelecionado}
        onPress={handleContinuar}
      >
        <Text style={styles.continuarText}>Continuar</Text>
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
  cartIcon: {
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
  metodosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  metodoBox: {
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  metodoSelecionado: {
    borderWidth: 2,
    borderColor: '#242760',
    backgroundColor: '#E9E9F5',
  },
  metodoIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  metodoText: {
    fontSize: 16,
    fontWeight: '700',
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
