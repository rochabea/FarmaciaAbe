import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

type Product = {
  id: string;
  name: string;
  price_cents: number;
  image_url?: string | null;
  created_at?: string | null;
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function HomeScreen() {
  const router = useRouter();
  const [showOffer, setShowOffer] = useState(true);
  const [highlights, setHighlights] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      console.log("🔧 SUPABASE_URL:", SUPABASE_URL);
      console.log("🔧 SUPABASE_ANON existe:", !!SUPABASE_ANON);
      console.log("🔧 SUPABASE_ANON primeiros chars:", SUPABASE_ANON?.substring(0, 20) + "...");
      
      if (!SUPABASE_URL || !SUPABASE_ANON) {
        const msg = "Variáveis de ambiente não configuradas. Verifique EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY";
        setErrorMsg(msg);
        console.error("⚠️", msg);
        return;
      }

      const url = `${SUPABASE_URL}/rest/v1/products?select=id,name,price_cents,image_url,created_at&order=created_at.desc&limit=8`;
      console.log("📡 Request URL:", url);

      const headers = {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        accept: "application/json",
      };
      console.log("📡 Headers configurados:", { ...headers, apikey: "***", Authorization: "Bearer ***" });

      const res = await fetch(url, { headers });

      console.log("🌐 Status:", res.status, res.statusText);
      console.log("🌐 OK:", res.ok);
      console.log("🌐 Headers:", Object.fromEntries(res.headers.entries()));

      const bodyText = await res.text();
      console.log("🧾 Body length:", bodyText.length);
      console.log("🧾 Body preview:", bodyText.substring(0, 500));

      if (!res.ok) {
        let errorDetail = bodyText;
        try {
          const errorJson = JSON.parse(bodyText);
          errorDetail = errorJson.message || errorJson.hint || bodyText;
        } catch {}
        
        throw new Error(`HTTP ${res.status}: ${errorDetail}`);
      }

      const data: Product[] = JSON.parse(bodyText);
      console.log("✅ Produtos recebidos:", data.length);
      if (data.length > 0) {
        console.log("✅ Exemplo do primeiro produto:", JSON.stringify(data[0], null, 2));
      }
      
      setHighlights(data ?? []);
      setErrorMsg(null);
    } catch (e: any) {
      console.error("❌ ERRO:", e.message);
      console.error("❌ Stack:", e.stack);
      setErrorMsg(e?.message ?? "Erro ao buscar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Teste de conectividade
    (async () => {
      try {
        console.log("🔎 Testando conectividade...");
        const ping = await fetch("https://httpbin.org/get", { 
          method: "GET",
          headers: { accept: "application/json" }
        });
        console.log("🔎 Ping httpbin status:", ping.status);
      } catch (e: any) {
        console.log("🔎 Ping httpbin falhou:", e.message);
      }
    })();

    fetchProducts();
  }, []);

  const categories = [
    { name: "Medicamentos", icon: require("../../assets/images/medicamentos.png") },
    { name: "Bem-estar",    icon: require("../../assets/images/maos.png") },
    { name: "Maternidade",  icon: require("../../assets/images/bebe.png") },
    { name: "Cosméticos",   icon: require("../../assets/images/cosmeticos.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/cesta")}>
          <Image source={require("../../assets/images/car.png")} style={styles.icon} />
        </TouchableOpacity>

        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />

        <TouchableOpacity onPress={() => router.push("/notificacao")}>
          <Image source={require("../../assets/images/notificacao.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Banner ofertas */}
        {showOffer && (
          <Link href="/promo" asChild>
            <TouchableOpacity activeOpacity={0.9} style={styles.offerBox}>
              <Image source={require("../../assets/images/percent.png")} style={styles.offerPercent} />
              <Text style={styles.offerTitle}>OFERTAS</Text>
              <Text style={styles.offerSubtitle}>Veja as ofertas da semana</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  setShowOffer(false);
                }}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <Text style={{ color: "#000000ff", fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Link>
        )}

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {categories.map((cat) => {
            const Card = (
              <View key={cat.name} style={styles.categoryBox}>
                <Image source={cat.icon} style={styles.categoryIcon} resizeMode="contain" />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </View>
            );
            return cat.name === "Medicamentos" ? (
              <Link key={cat.name} href="/medicamentos" asChild>
                <TouchableOpacity activeOpacity={0.8}>{Card}</TouchableOpacity>
              </Link>
            ) : (
              Card
            );
          })}
        </ScrollView>

        {/* Destaques */}
        <Text style={styles.sectionTitle}>Destaques</Text>

        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#242760" />
            <Text style={{ textAlign: "center", marginTop: 8, color: "#888" }}>
              Carregando produtos...
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ textAlign: "center", color: "crimson", fontSize: 14, marginBottom: 8 }}>
              ⚠️ Erro ao carregar produtos
            </Text>
            <Text style={{ textAlign: "center", color: "#666", fontSize: 12 }}>
              {errorMsg}
            </Text>
            <TouchableOpacity 
              onPress={fetchProducts}
              style={{ 
                marginTop: 12, 
                backgroundColor: "#242760", 
                padding: 12, 
                borderRadius: 8,
                alignSelf: "center"
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : highlights.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>
            Nenhum produto encontrado.
          </Text>
        ) : (
          <View style={styles.highlightsGrid}>
            {highlights.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.highlightBoxGrid}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: "/produto/tela_produto", params: { id: item.id } })}
              >
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.highlightIconGrid} resizeMode="contain" />
                ) : (
                  <Image source={require("../../assets/images/remedio.png")} style={styles.highlightIconGrid} resizeMode="contain" />
                )}
                <View style={{ width: "100%", paddingHorizontal: 10 }}>
                  <Text style={styles.highlightName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.highlightSubtitle}>Oferta por</Text>
                  <Text style={styles.highlightPrice}>
                    R$ {(item.price_cents / 100).toFixed(2).replace(".", ",")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  icon: { width: 30, height: 30 },
  logo: { width: 100, height: 40 },
  offerBox: { margin: 20, backgroundColor: "#F4F4F7", borderRadius: 12, padding: 20, position: "relative" },
  offerTitle: { fontSize: 25, fontWeight: "700", color: "#242760", marginLeft: 90 },
  offerSubtitle: { fontSize: 14, color: "#000", marginTop: 5, marginLeft: 90 },
  offerPercent: { width: 83, height: 83, position: "absolute", left: 5, top: 5 },
  closeButton: { position: "absolute", top: 10, right: 10, backgroundColor: "#F4F4F7", borderRadius: 15, width: 25, height: 25, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#242760", marginTop: 20, marginBottom: 10, paddingLeft: 20 },
  categoryBox: { width: 120, height: 100, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15, backgroundColor: "#F4F4F7" },
  categoryIcon: { width: 40, height: 40, marginBottom: 5 },
  categoryText: { fontSize: 14, fontWeight: "600", color: "#242760", textAlign: "center" },
  highlightsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20 },
  highlightBoxGrid: { width: "48%", height: 180, marginBottom: 15, borderRadius: 12, justifyContent: "center", alignItems: "flex-start", backgroundColor: "#F4F4F7" },
  highlightIconGrid: { width: 93, height: 67, alignSelf: "center", marginBottom: 5 },
  highlightName: { fontSize: 16, fontWeight: "600", color: "#242760", textAlign: "left", marginTop: 5 },
  highlightSubtitle: { fontSize: 16, fontWeight: "600", color: "#000000ff", textAlign: "left", marginTop: 5 },
  highlightPrice: { fontSize: 16, fontWeight: "700", color: "#000000ff", textAlign: "left", marginTop: 2 },
});