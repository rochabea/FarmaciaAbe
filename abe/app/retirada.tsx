import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchPharmacies, searchPharmacies, Pharmacy } from '../lib/pharmacies';

export default function Retirada() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;

  const [farmaciaSelecionada, setFarmaciaSelecionada] = useState<string | null>(null);
  const [farmacias, setFarmacias] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Carrega todas as farmácias ao montar o componente
  useEffect(() => {
    loadPharmacies();
  }, []);

  // Busca farmácias quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      loadPharmacies();
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300); // Debounce de 300ms
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const data = await fetchPharmacies();
      setFarmacias(data);
    } catch (error: any) {
      console.error('Erro ao carregar farmácias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as farmácias. Tente novamente.');
      setFarmacias([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (term.trim() === '') {
      loadPharmacies();
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchPharmacies(term);
      setFarmacias(results);
    } catch (error: any) {
      console.error('Erro ao buscar farmácias:', error);
      Alert.alert('Erro', 'Não foi possível buscar as farmácias. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinuar = () => {
    if (farmaciaSelecionada) {
      const farmacia = farmacias.find(f => f.id === farmaciaSelecionada);
      if (farmacia) {
        router.push({
          pathname: '/opcao-pagamentoR',
          params: {
            subtotal: subtotalValor.toFixed(2),
            farmacia: encodeURIComponent(farmacia.nome),
            farmaciaId: farmacia.id,
            endereco: encodeURIComponent(farmacia.endereco),
            distancia: encodeURIComponent(farmacia.distancia || 'N/A'),
          },
        });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Retirada</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Título */}
      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Escolha a farmácia para retirada</Text>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar farmácia..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#242760" style={styles.searchLoader} />
        )}
      </View>

      {/* Lista de farmácias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#242760" />
          <Text style={styles.loadingText}>Carregando farmácias...</Text>
        </View>
      ) : farmacias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchTerm.trim() 
              ? 'Nenhuma farmácia encontrada com esse nome.' 
              : 'Nenhuma farmácia cadastrada no momento.'}
          </Text>
          {searchTerm.trim() && (
            <TouchableOpacity 
              style={styles.clearSearchBtn}
              onPress={() => {
                setSearchTerm('');
                loadPharmacies();
              }}
            >
              <Text style={styles.clearSearchText}>Ver todas as farmácias</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.listaFarmacias}>
          {farmacias.map((farmacia) => (
            <TouchableOpacity 
              key={farmacia.id} 
              style={[styles.caixaFarmacia, farmaciaSelecionada === farmacia.id && styles.caixaSelecionada]}
              onPress={() => setFarmaciaSelecionada(farmacia.id)}
            >
              <Image 
                source={require('../assets/images/retirada.png')} 
                style={styles.iconeFarmacia} 
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.nomeFarmacia}>{farmacia.nome}</Text>
                <Text style={styles.enderecoFarmacia}>
                  {farmacia.endereco} - {farmacia.cidade}, {farmacia.estado}
                </Text>
                {farmacia.telefone && (
                  <Text style={styles.telefoneFarmacia}>Tel: {farmacia.telefone}</Text>
                )}
              </View>
              {farmacia.distancia && (
                <Text style={styles.distanciaFarmacia}>{farmacia.distancia}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão continuar */}
      <TouchableOpacity 
        style={[styles.continuarBtn, !farmaciaSelecionada && { opacity: 0.5 }]} 
        disabled={!farmaciaSelecionada}
        onPress={handleContinuar}
      >
        <Text style={styles.continuarText}>Continuar</Text>
      </TouchableOpacity>
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
  notification: {
    position: 'absolute',
    right: 20,
    top: 92,
  },
  notificationIcon: {
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
  sacolaIcon: {
    width: 70,
    height: 70,
  },
  linhaTitulo: {
    width: '90%',
    marginBottom: 15,
  },
  tituloEntrega: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
  },
  searchContainer: {
    width: '90%',
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchLoader: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    width: '90%',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '90%',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  clearSearchBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#242760',
    borderRadius: 8,
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listaFarmacias: {
    width: '90%',
  },
  caixaFarmacia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#F4F4F7',
  },
  caixaSelecionada: {
    borderColor: '#242760',
  },
  iconeFarmacia: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  nomeFarmacia: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 4,
  },
  enderecoFarmacia: {
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: 2,
  },
  telefoneFarmacia: {
    fontSize: 12,
    color: '#6E6E6E',
  },
  distanciaFarmacia: {
    fontSize: 14,
    fontWeight: '700',
    color: '#242760',
    marginLeft: 10,
  },
  continuarBtn: {
    backgroundColor: '#242760',
    width: '90%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
