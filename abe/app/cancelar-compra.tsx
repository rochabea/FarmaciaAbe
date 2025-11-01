import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CancelarCompra() {
  const router = useRouter();

  const handleVoltar = () => {
    router.back();
  };

  const handleCancelarCompra = () => {
    alert('Compra cancelada!');
    router.push('/compra_cancelada'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Topo */}
      <View style={styles.topRect}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
            <Image 
              source={require('../assets/images/seta-esquerda.png')} 
              style={styles.backIcon} 
            />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Cancelar Compra</Text>
          <View style={{ width: 25 }} />
        </View>

        <View style={styles.iconCircle}>
          <Image
            source={require('../assets/images/cancelar.png')} 
            style={styles.icon}
          />
        </View>
      </View>

      {/* Texto explicativo */}
      <View style={styles.textBox}>
        <Text style={styles.text}>
          <Text style={styles.textBoldBlack}>Consequências do Cancelamento de Pedido{'\n'}</Text>
          <Text style={styles.textItem}>1. Pedido será cancelado imediatamente{'\n'}</Text>
          <Text style={styles.textItem}>2. Nenhum produto será enviado.{'\n'}</Text>
          <Text style={styles.textItem}>3. Não é possível reverter a ação{'\n'}</Text>
          <Text style={styles.textItem}>4. Reembolso (se houver pagamento){'\n'}</Text>
          <Text style={styles.textItem}>- O valor pago será devolvido conforme a política da empresa.{'\n'}</Text>
          <Text style={styles.textItem}>- O prazo de reembolso pode variar de acordo com o banco ou forma de pagamento.{'\n'}</Text>
          <Text style={styles.textItem}>5. O pedido ficará registrado como "Cancelado" no seu histórico.</Text>
        </Text>
      </View>

      {/* Caixa de confirmação */}
      <View style={styles.confirmBox}>
        <Image
          source={require('../assets/images/alerta.png')} 
          style={styles.alertIcon}
        />
        <Text style={styles.confirmText}>
          <Text style={styles.confirmTextRedBold}>
            Tem certeza que deseja cancelar este pedido?
          </Text>
        </Text>
        <TouchableOpacity style={styles.voltarBtn} onPress={handleVoltar}>
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelarCompra}>
          <Text style={styles.cancelText}>Cancelar compra</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 60,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: -30, 
  },

  backButton: { 
    width: 25, 
    height: 25,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  topTitle: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '700',
    textAlign: 'center',
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
  icon: { 
    width: 80, 
    height: 80, 
    resizeMode: 'contain' 
  },

  textBox: { 
    width: '90%', 
    marginBottom: 30
  },
  text: { 
    lineHeight: 22 
  },
  textBoldBlack: { 
    fontWeight: '700', 
    color: '#000', 
    fontSize: 12 
  },
  textItem: { 
    fontWeight: '700', 
    color: '#000', 
    fontSize: 12 
  }, 

  confirmBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },
  alertIcon: { 
    width: 73, 
    height: 73, 
    marginBottom: 10 
  },
  confirmText: { 
    textAlign: 'center', 
    fontWeight: '700' 
  },
  confirmTextRedBold: { 
    fontWeight: '700', 
    fontSize: 18, 
    color: '#E04242' 
  }, 

  voltarBtn: {
    width: '80%',
    backgroundColor: '#2CA77D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  voltarText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 20 
  },
  cancelBtn: {
    width: '80%',
    backgroundColor: '#E04242',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 20 
  },
});
