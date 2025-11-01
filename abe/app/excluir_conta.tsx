import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExcluirConta() {
  const router = useRouter();

  const handleCancelar = () => {
    router.push('/conta'); 
  };

  const handleExcluir = () => {
    router.push('/bemvindo'); 
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ alignItems: 'center' }}>
      {/* TOPO */}
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={handleCancelar}>
          <Image
            source={require('../assets/images/seta-esquerda.png')}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Excluir Conta</Text>

        <View style={estilos.circuloIcone}>
          <Image
            source={require('../assets/images/excluir.png')} // ícone da lixeira
            style={estilos.iconeCentral}
          />
        </View>
      </View>

      {/* DETALHES */}
      <View style={estilos.detalhes}>
        <Text style={estilos.textoDetalhes}>
        Detalhes das consequências:{'\n'}
          • Seus dados serão removidos do sistema.{'\n'}
          • Não será possível recuperar histórico de compras ou mensagens.{'\n'}
          • Você precisará criar uma nova conta se quiser voltar.
        </Text>
        <Text style={estilos.textoAviso}>
          Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.
        </Text>
      </View>

      {/* CARD ALERTA */}
      <View style={estilos.cardAlerta}>
        <Image
          source={require('../assets/images/alerta.png')}
          style={estilos.iconeAlerta}
        />
        <Text style={estilos.textoCardAlerta}>
          Tem certeza que deseja excluir sua{'\n'}conta?
        </Text>

        <View style={estilos.botoesLinha}>
          <TouchableOpacity style={estilos.botaoCancelar} onPress={handleCancelar}>
            <Text style={estilos.textoBotao}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoExcluir} onPress={handleExcluir}>
            <Image
              source={require('../assets/images/excluir.png')}
              style={estilos.iconeBotao}
            />
            <Text style={estilos.textoBotao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: 81,
    height: 81,
    resizeMode: 'contain',
    tintColor: '#242760',
  },

  detalhes: {
    marginTop: 80,
    width: '85%',
  },
  textoDetalhes: {
    fontSize: 16,        
    fontWeight: '700',    
    color: '#000',
    marginBottom: 10,
  },
  textoAviso: {
    fontSize: 14,        
    fontWeight: '700',    
    color: '#5B5B5B',
  },

  cardAlerta: {
    width: '85%',
    backgroundColor: '#F6F6F9',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  iconeAlerta: {
    width: 81,
    height: 81,
    marginBottom: 10,
    tintColor: '#5B5B5B',
  },
  textoCardAlerta: {
    fontSize: 18,       
    fontWeight: '700',   
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  botaoCancelar: {
    width: 139,
    height: 40,
    backgroundColor: '#242760',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoExcluir: {
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
  iconeBotao: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});
