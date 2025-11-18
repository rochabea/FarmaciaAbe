import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function FormaEntrega() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;
  const [forma, setForma] = useState<'entrega' | 'retirada' | null>(null);
  
  // Estados para cálculo de frete
  const [cep, setCep] = useState("");
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [freteValor, setFreteValor] = useState<number | null>(null);
  const [fretePrazo, setFretePrazo] = useState<string | null>(null);
  const [freteErro, setFreteErro] = useState<string | null>(null);

  // Função para calcular frete
  const handleCalcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setFreteErro("Informe um CEP válido com 8 dígitos");
      setFreteValor(null);
      setFretePrazo(null);
      return;
    }

    setFreteErro(null);
    setCalculandoFrete(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const faixa = Number(cepLimpo.slice(0, 2));
      let valor = 9.9;
      let prazo = "3 a 5 dias úteis";

      if (faixa <= 20) {
        valor = 7.9;
        prazo = "2 a 4 dias úteis";
      } else if (faixa >= 70) {
        valor = 14.9;
        prazo = "5 a 8 dias úteis";
      }

      setFreteValor(valor);
      setFretePrazo(prazo);
    } catch (err) {
      console.error(err);
      setFreteErro("Não foi possível calcular o frete. Tente novamente.");
    } finally {
      setCalculandoFrete(false);
    }
  };

  // Calcula o total com frete
  const totalComFrete = subtotalValor + (freteValor || 0);

  const handleContinuar = () => {
    if (forma === 'entrega') {
      // Se for entrega, passa o subtotal e o frete
      const freteParam = freteValor ? freteValor.toFixed(2) : '0';
      router.push(`/entrega?subtotal=${subtotalValor}&frete=${freteParam}`);
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

      {/* Campo de cálculo de frete (apenas quando entrega for selecionada) */}
      {forma === 'entrega' && (
        <View style={styles.freteBox}>
          <Text style={styles.freteTitle}>Calcular Frete</Text>
          <View style={styles.freteForm}>
            <TextInput
              style={styles.cepInput}
              placeholder="00000-000"
              placeholderTextColor="#999"
              value={cep}
              onChangeText={(text) => {
                // Formata o CEP enquanto digita
                const cepLimpo = text.replace(/\D/g, "");
                if (cepLimpo.length <= 8) {
                  const cepFormatado = cepLimpo.replace(/(\d{5})(\d)/, "$1-$2");
                  setCep(cepFormatado);
                }
              }}
              keyboardType="numeric"
              maxLength={9}
            />
            <TouchableOpacity
              style={[styles.calcFreteBtn, calculandoFrete && { opacity: 0.6 }]}
              onPress={handleCalcularFrete}
              disabled={calculandoFrete}
            >
              {calculandoFrete ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.calcFreteTxt}>Calcular</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {freteErro && (
            <Text style={styles.freteErro}>{freteErro}</Text>
          )}
          
          {freteValor !== null && !freteErro && (
            <View style={styles.freteResult}>
              <Text style={styles.freteValorText}>
                Frete: R$ {freteValor.toFixed(2)}
              </Text>
              {fretePrazo && (
                <Text style={styles.fretePrazoText}>
                  Prazo: {fretePrazo}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Subtotal e Total */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal: R$ {subtotalValor.toFixed(2)}</Text>
        {forma === 'entrega' && freteValor !== null && (
          <Text style={styles.freteText}>Frete: R$ {freteValor.toFixed(2)}</Text>
        )}
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>
          R$ {forma === 'entrega' && freteValor !== null ? totalComFrete.toFixed(2) : subtotalValor.toFixed(2)}
        </Text>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity 
        style={[
          styles.continuarBtn, 
          (!forma || (forma === 'entrega' && freteValor === null)) && { opacity: 0.5 }
        ]} 
        disabled={!forma || (forma === 'entrega' && freteValor === null)}
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
  freteBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  freteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 10,
  },
  freteForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cepInput: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  calcFreteBtn: {
    height: 45,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#242760',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcFreteTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  freteErro: {
    marginTop: 8,
    fontSize: 12,
    color: '#EF4444',
  },
  freteResult: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  freteValorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
  },
  fretePrazoText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  freteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 5,
  },
});
