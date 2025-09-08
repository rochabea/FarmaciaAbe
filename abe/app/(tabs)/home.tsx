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
    { name: 'Destaque 1', icon: require('../../assets/images/remedio.png') },
    { name: 'Destaque 2', icon: require('../../assets/images/remedio.png') },
    { name: 'Destaque 3', icon: require('../../assets/images/remedio.png') },
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
            <Text style={styles.offerTitle}>Oferta</Text>
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

        {/* Destaques */}
        <Text style={styles.sectionTitle}>Destaques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {highlights.map((item, index) => (
            <View key={index} style={styles.highlightBox}>
              <Image source={item.icon} style={styles.highlightIcon} resizeMode="contain" />
              <Text style={styles.highlightText}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 40 },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20 },

  icon: { 
    width: 30, 
    height: 30 },

  logo: { 
    width: 100, 
    height: 40 },

  offerBox: { 
    margin: 20, 
    backgroundColor: '#F4F4F7', 
    borderRadius: 12, 
    padding: 20, 
    position: 'relative' },

  offerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#242760', 
    marginLeft: 60 },

  offerSubtitle: { 
    fontSize: 14, 
    color: '#000', 
    marginTop: 5, 
    marginLeft: 60 },

  offerPercent: { 
    width: 50, 
    height: 50, 
    position: 'absolute', 
    left: 20, 
    top: 20 },

  closeButton: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: '#F4F4F7',
    borderRadius: 15, 
    width: 25, 
    height: 25, 
    justifyContent: 'center', 
    alignItems: 'center' },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#242760', 
    marginTop: 20, 
    marginBottom: 10, 
    paddingLeft: 20 },

  categoryBox: { 
    width: 120, 
    height: 100, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15, 
    backgroundColor: '#F4F4F7' },

  categoryIcon: { 
    width: 40, 
    height: 40, 
    marginBottom: 5 },

  categoryText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#242760', 
    textAlign: 'center' },

  highlightBox: { 
    width: 150, 
    height: 150, 
    marginRight: 15, 
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F7' },

  highlightIcon: { 
    width: 80, 
    height: 80, 
    marginBottom: 5 },

  highlightText: { 
    color: '#242760', 
    fontWeight: '600', 
    textAlign: 'center' 
  },
});
