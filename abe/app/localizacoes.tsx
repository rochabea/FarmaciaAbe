import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EnderecosParams } from './parametros/Enderecos';

export default function Localizacoes() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [enderecos, setEnderecos] = useState([...EnderecosParams.enderecos]);

  useEffect(() => {
    if (params.novoEndereco) {
      const endereco = JSON.parse(params.novoEndereco as string);
      EnderecosParams.enderecos.push(endereco);
      setEnderecos([...EnderecosParams.enderecos]);
    }
  }, [params.novoEndereco]);

  const removerEndereco = (id: number) => {
    EnderecosParams.enderecos = EnderecosParams.enderecos.filter(e => e.id !== id);
    setEnderecos([...EnderecosParams.enderecos]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require('../assets/images/seta-esquerda.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Localizações</Text>
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image
            source={require('../assets/images/notificacaoB.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Image
            source={require('../assets/images/local (2).png')}
            style={styles.cartIcon}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {enderecos.map((e) => (
          <View key={e.id} style={styles.localizacaoBox}>
            <View>
              <Text style={styles.nomeLocalizacao}>
                {e.logradouro} - {e.numero}
              </Text>
              <Text style={styles.infoLocalizacao}>
                {e.cep} - {e.cidade}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removerEndereco(e.id)}>
              <Text style={styles.removerText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.adicionarBtn}
          onPress={() => router.push('/add-endereco')}
        >
          <Text style={styles.adicionarText}>Adicionar Endereço</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRect: {
    width: '100%',
    height: 180,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 50,
  },
  topTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  notification: {
    position: 'absolute',
    right: 20,
    top: 50,
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
    width: 81,
    height: 81,
    resizeMode: 'contain',
  },
  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  localizacaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9E9F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  nomeLocalizacao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
  },
  infoLocalizacao: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
    marginTop: 5,
  },
  removerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  adicionarBtn: {
    backgroundColor: '#242760',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  adicionarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
