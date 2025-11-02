import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../lib/supabase"; 

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price_cents: number;
};

export default function TesteSupabaseScreen() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(3);

      if (error) setError(error.message);
      else setData(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return (<View style={styles.center}><ActivityIndicator /><Text>Conectando...</Text></View>);
  if (error)   return (<View style={styles.center}><Text style={styles.err}>Erro: {error}</Text></View>);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conexão OK</Text>
      {data.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.name}>{p.name}</Text>
          <Text>R$ {(p.price_cents / 100).toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:{flex:1,justifyContent:"center",alignItems:"center"},
  container:{padding:16},
  title:{fontSize:18,fontWeight:"bold",marginBottom:12},
  card:{padding:12,backgroundColor:"#f3f3f3",borderRadius:10,marginBottom:10},
  name:{fontWeight:"bold"},
  err:{color:"red"}
});
