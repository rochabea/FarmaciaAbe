import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Privacidade() {
  const router = useRouter();

  return (
    <View style={estilos.container}>
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image source={require('../../assets/images/seta-esquerda.png')} style={estilos.iconeVoltar} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoNotificacao} onPress={() => router.push('/entregador/notificacao_ent')}>
          <Image source={require('../../assets/images/notificacao.png')} style={estilos.iconeNotificacao} />
        </TouchableOpacity>
        <Text style={estilos.tituloTopo}>Privacidade</Text>
        <View style={estilos.circuloIcone}>
          <Image source={require('../../assets/images/privacidade.png')} style={estilos.iconeCentral} />
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.subtitulo}>
          Seus dados são usados apenas para o funcionamento do aplicativo. {"\n"}
          <Text style={{ fontWeight: '700' }}>Nunca vendemos suas informações.</Text>
        </Text>

        {/* Seção de opções */}
        <View style={estilos.secao}>
          <TouchableOpacity style={estilos.opcao} onPress={() => router.push('/entregador/seguranca_ent')}>
            <Text style={estilos.textoOpcao}>Segurança</Text>
            <Image source={require('../../assets/images/seta-direita.png')} style={estilos.iconeSeta} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.opcao} onPress={() => router.push('/entregador/politica_ent')}>
            <Text style={estilos.textoOpcao}>Política de privacidade</Text>
            <Image source={require('../../assets/images/seta-direita.png')} style={estilos.iconeSeta} />
          </TouchableOpacity>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Quando os dados são coletados</Text>
          <Text style={estilos.itemDestaque}>• No cadastro, para criar sua conta.</Text>
          <Text style={estilos.itemDestaque}>• Ao criar ou receber promoções.</Text>
          <Text style={estilos.itemDestaque}>• Durante o envio de notificações e acessos ao app.</Text>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Como os dados são protegidos</Text>
          <Text style={estilos.itemDestaque}>• Usamos criptografia para proteger suas informações.</Text>
          <Text style={estilos.itemDestaque}>• O acesso é restrito apenas a pessoas autorizadas.</Text>
          <Text style={estilos.itemDestaque}>• Monitoramos para evitar acessos indevidos.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topo: {
    width: '100%',
    height: 200,
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 40,
  },
  tituloTopo: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 30,
  },
  botaoVoltar: { 
    position: 'absolute', 
    left: 20, 
    top: 70 
},
  iconeVoltar: { 
    width: 30, 
    height: 30, 
    tintColor: '#fff' 
},
  botaoNotificacao: { 
    position: 'absolute', 
    right: 20,
    top: 70 
},
  iconeNotificacao: { 
    width: 30, 
    height: 30, 
    tintColor: '#fff' 
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

  conteudo: { 
    paddingTop: 80, 
    paddingHorizontal: 20, 
    paddingBottom: 40 
},
  subtitulo: { 
    fontSize: 16,
     color: '#000', 
     textAlign: 'left', 
     marginBottom: 30, 
     fontWeight: '700' 
    },

  secao: { 
    marginBottom: 25 
},
  tituloSecao: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#000', 
    marginBottom: 10 
},

  item: { 
    fontSize: 15, 
    color: '#000', 
    fontWeight: '700', 
    marginBottom: 6 
},
  itemDestaque: { 
    fontSize: 15, 
    color: '#544C4C', 
    fontWeight: '700', 
    marginBottom: 6 
},
  opcao: {
    backgroundColor: '#F4F4F7',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoOpcao: { 
    fontSize: 16,
     color: '#000', 
     fontWeight: '700' 
    },
  iconeSeta: { 
    width: 20, 
    height: 20, 
    tintColor: '#000' 
},
});
