import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Sair() {
  const router = useRouter();

  const handleCancelar = () => {
    router.push('/conta'); 
  };

  const handleVoltar = () => {
    router.push('/conta'); 
  };

  const handleSair = () => {
    router.push('/login'); 
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={handleVoltar}>
          <Image
            source={require('../assets/images/seta-esquerda.png')}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Sair</Text>

        <View style={estilos.circuloIcone}>
          <Image
            source={require('../assets/images/sair.png')}
            style={estilos.iconeCentral}
          />
        </View>
      </View>

      {/* CARD CENTRAL */}
      <View style={estilos.card}>
        <Image
          source={require('../assets/images/alerta.png')}
          style={estilos.iconeAlerta}
        />
        <Text style={estilos.textoCard}>
          Tem certeza que deseja deslogar sua conta?
        </Text>

        <View style={estilos.botoesLinha}>
          {/* Botão Cancelar */}
          <TouchableOpacity style={estilos.botaoCancelar} onPress={handleCancelar}>
            <Text style={estilos.textoBotao}>Cancelar</Text>
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity style={estilos.botaoSair} onPress={handleSair}>
            <Image
              source={require('../assets/images/sair.png')}
              style={estilos.iconeBotaoSair}
            />
            <Text style={estilos.textoBotao}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  topo: {
    width: '100%',
    height: 200,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    position: 'relative',
  },
  tituloTopo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 35,
  },
  botaoVoltar: {
    position: 'absolute',
    left: 20,
    top: 70,
  },
  iconeVoltar: {
    width: 34,
    height: 34,
    tintColor: '#fff',
  },

  circuloIcone: {
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
  iconeCentral: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    tintColor: '#242760',
  },

  card: {
    backgroundColor: '#F6F6F9',
    width: '85%',
    borderRadius: 12,
    marginTop: 100,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAlerta: {
    width: 81,
    height: 81,
    resizeMode: 'contain',
    tintColor: '#5B5B5B',
    marginBottom: 10,
  },
  textoCard: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },

  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  botaoCancelar: {
    width: 139,
    height: 40,
    backgroundColor: '#242760',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoSair: {
    width: 139,
    height: 40,
    backgroundColor: '#242760',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  textoBotao: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  iconeBotaoSair: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});
