import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  const categories = [
    { name: 'Medicamentos', icon: require('../../assets/images/medicamentos.png') },
    { name: 'Bem-estar', icon: require('../../assets/images/maos.png') },
    { name: 'Maternidade', icon: require('../../assets/images/bebe.png') },
    { name: 'Cosméticos', icon: require('../../assets/images/cosmeticos.png') },
    { name: 'Manipulados', icon: require('../../assets/images/vitamina.png') },
    { name: 'Higiene', icon: require('../../assets/images/higiene.png') },
    { name: 'Cabelos', icon: require('../../assets/images/cabelos.png') },
    { name: 'Cuidados com a pele', icon: require('../../assets/images/pele.png') },
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

      {/* Campo de pesquisa */}
      <View style={styles.searchBox}>
        <Image source={require('../../assets/images/lupa.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produtos ou categorias"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Título */}
        <Text style={styles.sectionTitle}>Categorias</Text>

        {/* Grid de categorias */}
        <View style={styles.categoriesGrid}>
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryBox}>
              <Image source={cat.icon} style={styles.categoryIcon} resizeMode="contain" />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 45,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#242760', 
    marginTop: 20, 
    marginBottom: 10, 
    paddingLeft: 20 
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  categoryBox: { 
    width: '48%',
    height: 120,
    borderRadius: 12,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15, 
    backgroundColor: '#F4F4F7' 
  },

  categoryIcon: { 
    width: 50, 
    height: 50, 
    marginBottom: 10 
  },

  categoryText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#000000ff', 
    textAlign: 'center' 
  },
});
