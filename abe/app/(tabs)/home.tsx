import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function TabOneScreen() {
  const [showOffer, setShowOffer] = useState(true);

  const categories = [
    { name: 'Medicamentos', icon: require('../../assets/images/medicamentos.png') },
    { name: 'Bem-estar', icon: require('../../assets/images/maos.png') },
    { name: 'Maternidade', icon: require('../../assets/images/bebe.png') },
    { name: 'Cosméticos', icon: require('../../assets/images/cosmeticos.png') },
  ];

  const highlights = [
    { name: 'Aspirina', icon: require('../../assets/images/remedio.png') },
    { name: 'Paracetamol', icon: require('../../assets/images/remedio.png') },
    { name: 'Ibuprofeno', icon: require('../../assets/images/remedio.png') },
    { name: 'Vitamina C', icon: require('../../assets/images/remedio.png') },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/car.png')} style={styles.icon} />
        </TouchableOpacity>

        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <TouchableOpacity>
          <Image source={require('../../assets/images/notificacao.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Caixinha de oferta */}
        {showOffer && (
          <View style={styles.offerBox}>
            <Image source={require('../../assets/images/percent.png')} style={styles.offerPercent} />
            <Text style={styles.offerTitle}>OFERTAS</Text>
            <Text style={styles.offerSubtitle}>Veja as ofertas da semana</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowOffer(false)}>
              <Text style={{ color: '#000000ff' }}>X</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {categories.map((cat, index) => (
            <View key={index} style={styles.categoryBox}>
              <Image source={cat.icon} style={styles.categoryIcon} resizeMode="contain" />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Destaques em grid 2x2 */}
        <Text style={styles.sectionTitle}>Destaques</Text>
        <View style={styles.highlightsGrid}>
          {highlights.map((item, index) => (
            <View key={index} style={styles.highlightBoxGrid}>
              <Image source={item.icon} style={styles.highlightIconGrid} resizeMode="contain" />

              {/* Conteúdo do card alinhado à esquerda */}
              <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <Text style={styles.highlightName}>{item.name}</Text>
                <Text style={styles.highlightSubtitle}>Oferta por</Text>
                <Text style={styles.highlightPrice}>R$ 10,99</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 60 
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },

  icon: { 
    width: 30, 
    height: 30 
  },

  logo: { 
    width: 100, 
    height: 40 
  },

  offerBox: { 
    margin: 20, 
    backgroundColor: '#F4F4F7', 
    borderRadius: 12, 
    padding: 20, 
    position: 'relative' 
  },

  offerTitle: { 
    fontSize: 25, 
    fontWeight: '700', 
    color: '#242760', 
    marginLeft: 90 
  },

  offerSubtitle: { 
    fontSize: 14, 
    color: '#000', 
    marginTop: 5, 
    marginLeft: 90 
  },

  offerPercent: { 
    width: 83, 
    height: 83, 
    position: 'absolute', 
    left: 5, 
    top: 5 
  },

  closeButton: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: '#F4F4F7',
    borderRadius: 15, 
    width: 25, 
    height: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#242760', 
    marginTop: 20, 
    marginBottom: 10, 
    paddingLeft: 20 
  },

  categoryBox: { 
    width: 120, 
    height: 100, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15, 
    backgroundColor: '#F4F4F7' 
  },

  categoryIcon: { 
    width: 40, 
    height: 40, 
    marginBottom: 5 
  },

  categoryText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#242760', 
    textAlign: 'center' 
  },

  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  highlightBoxGrid: {
    width: '48%',
    height: 180,
    marginBottom: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-start', 
    backgroundColor: '#F4F4F7',
  },

  highlightIconGrid: {
    width: 93,
    height: 67,
    alignSelf: 'center', 
    marginBottom: 5,
  },

  highlightName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
    textAlign: 'left',
    marginTop: 5,
  },

  highlightSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
    textAlign: 'left',
    marginTop: 5,
  },

  highlightPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000ff',
    textAlign: 'left',
    marginTop: 2,
  },
});
