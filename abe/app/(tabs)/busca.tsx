// app/search/index.tsx (ou o caminho onde você mantém a tela de busca)
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { searchProducts, formatPrice, type Product } from "../../lib/products";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const categories = [
    { name: "Analgésicos",          icon: require("../../assets/images/medicamentos.png"),  href: "/medicamentos" },
    { name: "Bem-estar",             icon: require("../../assets/images/maos.png"),         href: "/bemestar" },
    { name: "Maternidade",           icon: require("../../assets/images/bebe.png"),         href: "/maternidade" },
    { name: "Cosméticos",            icon: require("../../assets/images/cosmeticos.png"),   href: "/beleza" },
    { name: "Manipulados",           icon: require("../../assets/images/vitamina.png"),     href: "/manipulados/envio_manipulados" },
    { name: "Higiene",               icon: require("../../assets/images/higiene.png"),      href: "/higiene" },
    { name: "Cabelos",               icon: require("../../assets/images/cabelos.png"),      href: "/cabelos" },
    { name: "Vitaminas",             icon: require("../../assets/images/vitaminas.png"),    href: "/vitaminas" },
  ];

  const handleSearch = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    
    if (trimmedText === "") {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchProducts(trimmedText);
      setProducts(results);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce para evitar muitas buscas enquanto o usuário digita
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchText);
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timer);
  }, [searchText, handleSearch]);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push({ pathname: "/produto/tela_produto", params: { id: item.id } })}
      activeOpacity={0.8}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="contain" />
      ) : (
        <View style={[styles.productImage, styles.productImagePlaceholder]}>
          <Ionicons name="image-outline" size={32} color="#9CA3AF" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(item.price_cents)}
        </Text>
        {item.is_promotion && item.original_price_cents && (
          <Text style={styles.productOriginalPrice}>
            {formatPrice(item.original_price_cents)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/cesta")}>
          <Image source={require("../../assets/images/car.png")} style={styles.icon} />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => router.push("/notificacao")}>
          <Image source={require("../../assets/images/notificacao.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Campo de pesquisa */}
      <View style={styles.searchBox}>
        <Image source={require("../../assets/images/lupa.png")} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produtos ou categorias"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(searchText)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              setProducts([]);
              setHasSearched(false);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#242760" />
          <Text style={styles.loadingText}>Buscando produtos...</Text>
        </View>
      ) : hasSearched ? (
        // Mostra resultados da busca
        products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            contentContainerStyle={styles.productsList}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            ListHeaderComponent={
              <Text style={styles.resultsTitle}>
                {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
              </Text>
            }
          />
        ) : (
          <View style={styles.centerContainer}>
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>Produto indisponível</Text>
            <Text style={styles.emptySubtext}>
              Não encontramos produtos com "{searchText}"
            </Text>
          </View>
        )
      ) : (
        // Mostra categorias quando não há busca
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryBox}
                activeOpacity={0.85}
                onPress={() => router.push(cat.href)}
                accessibilityRole="button"
                accessibilityLabel={`Abrir categoria ${cat.name}`}
              >
                <Image source={cat.icon} style={styles.categoryIcon} resizeMode="contain" />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  icon: { width: 30, height: 30 },

  logo: { width: 100, height: 40 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F7",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 45,
  },

  searchIcon: { width: 20, height: 20, marginRight: 8 },

  searchInput: { flex: 1, fontSize: 16, color: "#000" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242760",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 20,
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  categoryBox: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F4F4F7",
  },

  categoryIcon: { width: 50, height: 50, marginBottom: 10 },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000ff",
    textAlign: "center",
  },

  // Estilos para busca de produtos
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242760",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  productsList: {
    padding: 20,
    paddingBottom: 40,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#F9FAFB",
  },
  productImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242760",
  },
  productOriginalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});
