import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Seguranca() {
  const router = useRouter();

  return (
    <View style={estilos.container}>
      {/* TOPO */}
      <View style={estilos.topo}>
        {/* Botão voltar */}
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={estilos.iconeVoltar} />
        </TouchableOpacity>

        {/* Notificação */}
        <TouchableOpacity style={estilos.botaoNotificacao} onPress={() => router.push('/notificacao')}>
          <Image source={require('../assets/images/notificacao.png')} style={estilos.iconeNotificacao} />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Segurança</Text>

        {/* Ícone central */}
        <View style={estilos.circuloIcone}>
          <Image source={require('../assets/images/seguranca.png')} style={estilos.iconeCentral} />
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Proteção dos dados:</Text>
          <Text style={estilos.itemDestaque}>• Informações armazenadas com criptografia avançada.</Text>
          <Text style={estilos.itemDestaque}>• Acesso restrito apenas a funcionários autorizados.</Text>
          <Text style={estilos.itemDestaque}>• Monitoramento contínuo de atividades suspeitas.</Text>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Segurança da conta:</Text>
          <Text style={estilos.itemDestaque}>• Senhas criptografadas e protegidas.</Text>
          <Text style={estilos.itemDestaque}>• Alertas em caso de acesso não autorizado.</Text>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Práticas gerais:</Text>
          <Text style={estilos.itemDestaque}>• Atualizações regulares para corrigir vulnerabilidades.</Text>
          <Text style={estilos.itemDestaque}>• Backups frequentes para garantir recuperação de dados.</Text>
          <Text style={estilos.itemDestaque}>• Cumprimento de leis de proteção de dados (LGPD/GDPR).</Text>
        </View>

        <Text style={estilos.rodape}>
          Como diria Sócrates, "o cuidado com o que nos pertence é essencial". Cuidamos dos seus dados com atenção e responsabilidade.
        </Text>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topo: {
    width: '100%',
    height: 200,
    backgroundColor: '#242760',
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
    paddingBottom: 40,
  },
  secao: {
    marginBottom: 25,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  itemDestaque: {
    fontSize: 15,
    color: '#544C4C',
    fontWeight: '700',
    marginBottom: 6,
  },
  rodape: {
    fontSize: 13,
    color: '#544C4C',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'left',
  },
});
