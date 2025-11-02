import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CartaoContext } from './parametros/CartaoContext';

// Tipagem do Cartão
interface Cartao {
  id: number;
  nome: string;
  numero: string;
  codigo?: string;
  vencimento?: string;
  bandeira?: string;
}

// Tipagem do Contexto
interface CartaoContextType {
  cartoes: Cartao[];
  adicionarCartao?: (cartao: any) => void;
}

export default function Cartoes() {
  const router = useRouter();
  const { cartoes } = useContext(CartaoContext) as CartaoContextType;
  const [listaCartoes, setListaCartoes] = useState<Cartao[]>([]);

  useEffect(() => {
    setListaCartoes(cartoes);
  }, [cartoes]);

  const handleRemover = (id: number) => {
    setListaCartoes(listaCartoes.filter(cartao => cartao.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon}/>
        </TouchableOpacity>

        <Text style={styles.topTitle}>Cartões</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon}/>
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/cartao-de-credito.png')} style={styles.cartIcon}/>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {listaCartoes.map((cartao: Cartao) => (
          <View key={cartao.id} style={styles.cardBox}>
            <View>
              <Text style={styles.nome}>{cartao.nome}</Text>
              <Text style={styles.numero}>{cartao.numero}</Text>
            </View>

            <TouchableOpacity onPress={() => handleRemover(cartao.id)}>
              <Text style={styles.remover}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.botaoAdd} onPress={() => router.push("/novo-cartao")}>
          <Text style={styles.textoAdd}>Adicionar Cartão</Text>
        </TouchableOpacity>
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
  topTitle:{
    color:'#fff',
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
  notification:{
    position:'absolute',
    right:20,
    top:50
},
  notificationIcon:{
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
    borderWidth:3,
    borderColor:'#fff'
  },
  cartIcon:{
    width:70,
    height:70,
    resizeMode:'contain'
},
  scrollContainer:{
    paddingTop:90,
    paddingHorizontal:20,
    paddingBottom:50
},
  cardBox:{
    width:'100%',
    backgroundColor:'#E9E9F5',
    borderRadius:12,
    padding:15,
    marginBottom:12,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  nome:{
    fontSize:15,
    fontWeight:'700',
    color:'#242760'
},
  numero:{
    marginTop:4,
    fontSize:13,
    fontWeight:'500',
    color:'#242760'
},
  remover:{
    fontSize:13,
    fontWeight:'700',
    color:'#000'
},

  botaoAdd:{
    backgroundColor:'#242760',
    paddingVertical:15,
    borderRadius:12,
    alignItems:'center',
    marginTop:20
  },
  textoAdd:{
    color:'#fff',
    fontWeight:'700',
    fontSize:16}
});
