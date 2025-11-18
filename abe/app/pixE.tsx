import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Clipboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createOrder } from '../lib/orders';
import { useCart } from './context/CartContext';

export default function Pix() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { refresh } = useCart();

  const [subtotalValor, setSubtotalValor] = useState(0);
  const [freteValor, setFreteValor] = useState(0);
  const [codigoPix, setCodigoPix] = useState('1234-5678-9012');

  useEffect(() => {
    if (params?.subtotal) {
      const valorConvertido = parseFloat(String(params.subtotal));
      if (!isNaN(valorConvertido)) {
        setSubtotalValor(valorConvertido);
      }
    }
    if (params?.frete) {
      const freteConvertido = parseFloat(String(params.frete));
      if (!isNaN(freteConvertido)) {
        setFreteValor(freteConvertido);
      }
    }
  }, [params]);

  const totalComFrete = subtotalValor + freteValor;

  const copiarCodigo = async () => {
    Clipboard.setString(codigoPix);
    alert('Código PIX copiado!');

    try {
      // Cria o pedido antes de redirecionar com o total incluindo frete
      const totalCents = Math.round(totalComFrete * 100);
      await createOrder(totalCents, 'entrega');
      
      // Atualiza o contexto do carrinho após criar o pedido
      await refresh();
      
      // Redirecionar para a tela "Compra Realizada" após criar o pedido
      setTimeout(() => {
        router.push('/compra-realizadaE');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      alert(`Erro ao finalizar pedido: ${error.message || 'Erro desconhecido'}`);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Topo */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Pix</Text>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/pix.png')} style={styles.pixIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Subtotal e Código PIX */}
      <View style={styles.boxPix}>
        <Text style={styles.label}>Subtotal: R$ {subtotalValor.toFixed(2)}</Text>
        {freteValor > 0 && (
          <Text style={styles.freteText}>Frete: R$ {freteValor.toFixed(2)}</Text>
        )}
        <Text style={styles.label}>Total: R$ {totalComFrete.toFixed(2)}</Text>

        <Text style={styles.label}>Código Pix</Text>
        <View style={styles.codigoContainer}>
          <TextInput
            style={styles.codigoInput}
            value={codigoPix}
            editable={false}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.copiarBtn} onPress={copiarCodigo}>
            <Text style={styles.copiarText}>Copiar código Pix</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instruções */}
      <View style={styles.instrucoes}>
        <Text style={styles.passos}>1. Copie o código PIX</Text>
        <Text style={styles.passos}>2. Acesse o app ou internet banking do seu banco</Text>
        <Text style={styles.passos}>3. Escolha a opção de pagamento via PIX</Text>
        <Text style={styles.passos}>4. Cole ou digite o código PIX</Text>
        <Text style={styles.passos}>5. Finalize o pagamento</Text>
        <Text style={styles.passos}>6. Após a confirmação, volte ao app para verificar o pagamento</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', paddingBottom: 40 },
  topRect: {
    width: '100%',
    height: 250,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 50,
  },
  backButton: { position: 'absolute', left: 20, top: 50 },
  backIcon: { width: 25, height: 25 },
  topTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 10 },
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
  pixIcon: { width: 70, height: 70, resizeMode: 'contain' },

  boxPix: {
    width: '90%',
    backgroundColor: '#E9E9F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  label: { fontWeight: '700', marginTop: 10, color: '#242760' },
  total: { fontSize: 20, fontWeight: '700', marginTop: 5, color: '#242760' },
  freteText: { fontSize: 14, fontWeight: '500', marginTop: 5, color: '#6B7280' },
  codigoContainer: { marginTop: 10 },
  codigoInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    marginBottom: 10,
  },
  copiarBtn: {
    backgroundColor: '#242760',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copiarText: { color: '#fff', fontWeight: '700' },

  instrucoes: { width: '90%', marginBottom: 20 },
  passos: { lineHeight: 25, marginBottom: 5, color: '#242760' },
});