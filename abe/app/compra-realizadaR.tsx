import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function CompraRealizada() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Compra realizada</Text>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/verificado.png')} style={styles.checkIcon} />
        </View>
      </View>

      <View style={styles.centralBox}>
        <View style={styles.mensagemBox}>
          <Image source={require('../assets/images/retirada.png')} style={styles.caminhaoIcon} />
          <Text style={styles.mensagemText}>
            Compra realizada com sucesso!{'\n'} Pode retirar seu pedido.
          </Text>

          <TouchableOpacity
            style={styles.avaliarBtn}
            onPress={() => router.push('/avaliacao')}
          >
            <Text style={styles.avaliarText}>Avaliar produto</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cancelarBtn}
          onPress={() => router.push('/cancelar-compra')} 
        >
          <Text style={styles.cancelarText}>Cancelar compra</Text>
        </TouchableOpacity>
      </View>
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
    checkIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    },
  centralBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
  },
  mensagemBox: {
    backgroundColor: '#F4F4F7',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  caminhaoIcon: {
    width: 71,
    height: 71,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  mensagemText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#27B190',
    marginBottom: 20,
  },
  avaliarBtn: {
    backgroundColor: '#242760',
    width: '80%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  avaliarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelarBtn: {
    backgroundColor: '#FF4D4D',
    width: '50%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});