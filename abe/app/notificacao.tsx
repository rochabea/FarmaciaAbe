import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotificacoesCliente() {
  const router = useRouter();

    const [notificacoes, setNotificacoes] = useState([
  { id: 1, texto: "Seu pedido saiu para entrega" },
  { id: 2, texto: "Seu pedido está a caminho aguarde no local" },
  { id: 3, texto: "Seu pedido foi cancelado com sucesso" },
  { id: 4, texto: "Promoção exclusiva liberada para seu perfil! Acesse o app" },
  { id: 5, texto: "Pagamento confirmado, obrigado por comprar com a gente!" },
]);

  const removerNotificacao = (id: number) => {
    setNotificacoes(notificacoes.filter(n => n.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Notificações</Text>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/notificacaoA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notificacoes.map(n => (
          <View key={n.id} style={styles.box}>
            <Text style={styles.texto}>{n.texto}</Text>
            <TouchableOpacity onPress={() => removerNotificacao(n.id)}>
              <Text style={styles.removerText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex:1, 
    backgroundColor:'#fff'
},
  topRect:{
    width:'100%', 
    height:180, 
    backgroundColor:'#242760', 
    borderBottomLeftRadius:80, 
    borderBottomRightRadius:80,
    alignItems:'center', 
    justifyContent:'flex-start', 
    position:'relative', 
    paddingTop:50
  },
  topTitle:{color:'#fff', 
    fontSize:24, 
    fontWeight:'700', 
    marginTop:20
},
  backButton:{ 
    position:'absolute', 
    left:20, 
    top:50
},
  backIcon:{
    width:25, 
    height:25
},
  iconCircle:{
    width:120,
    height:120,
    borderRadius:60,
    backgroundColor:'#fff', 
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:-60,
    borderWidth:4,
    borderColor:'#fff',
  },
  cartIcon:{ 
    width:75, 
    height:75, 
    resizeMode:'contain'
},
  scrollContainer:{ 
    paddingTop:80, 
    paddingHorizontal:20, 
    paddingBottom:40 
},
  box:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#E9E9F5',
    borderRadius:12,
    padding:15,
    marginBottom:15,
    alignItems:'center'
  },
  texto:{ 
    fontSize:14, 
    fontWeight:'600', 
    color:'#242760', 
    width:'75%' 
},
  removerText:{ 
    fontSize:14, 
    fontWeight:'700', 
    color:'#000' }
});
