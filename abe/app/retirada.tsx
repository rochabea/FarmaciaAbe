import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Retirada() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;

  const [farmaciaSelecionada, setFarmaciaSelecionada] = useState<number | null>(null);

  const farmacias = [
    { id: 1, nome: 'Drogasil', endereco: 'Rua A, 123', distancia: '1,2 km', icone: require('../assets/images/retirada.png') },
    { id: 2, nome: 'Drogaria São Paulo', endereco: 'Rua B, 456', distancia: '2,5 km', icone: require('../assets/images/retirada.png') },
    { id: 3, nome: 'Pague Menos', endereco: 'Rua C, 789', distancia: '3,1 km', icone: require('../assets/images/retirada.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Retirada</Text>

        <TouchableOpacity style={styles.notification}  onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Título */}
      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Quer retirar nessa farmácia?</Text>
      </View>

      {/* Lista de farmácias */}
      <View style={styles.listaFarmacias}>
        {farmacias.map((farmacia) => (
          <TouchableOpacity 
            key={farmacia.id} 
            style={[styles.caixaFarmacia, farmaciaSelecionada === farmacia.id && styles.caixaSelecionada]}
            onPress={() => setFarmaciaSelecionada(farmacia.id)}
          >
            <Image source={farmacia.icone} style={styles.iconeFarmacia} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeFarmacia}>{farmacia.nome}</Text>
              <Text style={styles.enderecoFarmacia}>{farmacia.endereco}</Text>
            </View>
            <Text style={styles.distanciaFarmacia}>{farmacia.distancia}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão continuar */}
      <TouchableOpacity 
        style={[styles.continuarBtn, !farmaciaSelecionada && { opacity: 0.5 }]} 
        disabled={!farmaciaSelecionada}
        onPress={() => {
          if (farmaciaSelecionada) {
            const farmacia = farmacias.find(f => f.id === farmaciaSelecionada);
            if (farmacia) {
            router.push(`/dados-farm?subtotal=${subtotalValor}&farmacia=${encodeURIComponent(farmacia.nome)}&km=${encodeURIComponent(farmacia.distancia)}`
            );
            }
        }
        }}
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
  listaFarmacias: {
    width: '90%',
  },
  caixaFarmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#F4F4F7',
  },
  caixaSelecionada: {
    borderColor: '#242760',
  },
  iconeFarmacia: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  nomeFarmacia: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
  },
  enderecoFarmacia: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  distanciaFarmacia: {
    fontSize: 14,
    fontWeight: '700',
    color: '#242760',
    marginLeft: 10,
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
});
