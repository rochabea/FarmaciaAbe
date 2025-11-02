import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function FormaEntrega() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;
  const [forma, setForma] = useState<'entrega' | 'retirada' | null>(null);

  const handleContinuar = () => {
    if (forma === 'entrega') {
      router.push(`/entrega?subtotal=${subtotalValor}`);
    } else if (forma === 'retirada') {
      router.push(`/retirada?subtotal=${subtotalValor}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/cesta')}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Forma de Entrega</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Você deseja retirar ou receber o seu pedido?</Text>
      </View>

      {/* Opções de entrega */}
      <View style={styles.opcoesRow}>
        <TouchableOpacity 
          style={[styles.caixa, forma === 'entrega' && styles.caixaSelecionada]}
          onPress={() => setForma('entrega')}
        >
          <Image source={require('../assets/images/entrega.png')} style={styles.icone} />
          <Text style={styles.caixaTexto}>Entrega</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.caixa, forma === 'retirada' && styles.caixaSelecionada]}
          onPress={() => setForma('retirada')}
        >
          <Image source={require('../assets/images/retirada.png')} style={styles.icone} />
          <Text style={styles.caixaTexto}>Retirada</Text>
        </TouchableOpacity>
      </View>

      {/* Subtotal e Total */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>R$ {subtotalValor.toFixed(2)}</Text>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity 
        style={[styles.continuarBtn, !forma && { opacity: 0.5 }]} 
        disabled={!forma}
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
  opcoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 40,
  },
  caixa: {
    width: '48%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F4F4F7',
  },
  caixaSelecionada: {
    borderColor: '#242760',
  },
  icone: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  caixaTexto: {
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
