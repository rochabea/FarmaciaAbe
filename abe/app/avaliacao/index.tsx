import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/** --- Componente de Estrelas --- */
function StarRating({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (n: number) => void;
  size?: number;
}) {
  return (
    <View style={styles.starsRow} accessible accessibilityLabel={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            accessibilityRole="button"
            accessibilityLabel={`Dar nota ${n}`}
            style={styles.starBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color={filled ? "#10153B" : "#10153B"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** --- Tela de Avaliação --- */
export default function AvaliacaoScreen() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const canSubmit = true || comment.trim().length > 0;

  const handleSubmit = async () => {
    // TODO: se quiser enviar para seu backend/Supabase, faça aqui.
    // Exemplo (pseudo):
    // await supabase.from('avaliacoes').insert({ rating, comment, created_at: new Date().toISOString() })
    Alert.alert("Obrigado!", "Sua avaliação foi enviada com sucesso.");
    setRating(0);
    setComment("");
    router.back(); // volta para tela anterior
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Avaliação</Text>

          {/* Ícone circular central */}
          <View style={styles.heroCircle}>
            <Ionicons name="person" size={40} color="#10153B" />
            <Ionicons
              name="heart"
              size={16}
              color="#10153B"
              style={{ position: "absolute", right: 18, bottom: 14 }}
            />
          </View>
        </View>

        {/* Conteúdo */}
        <View style={styles.container}>
          <Text style={styles.title}>Avalie sua{"\n"}experiência</Text>
          <Text style={styles.subtitle}>Sua opinião nos ajuda a melhorar!</Text>

          <Text style={styles.helper}>
            Avalie de 1 a 5 como você classificaria seu atendimento/compras
          </Text>

          <StarRating value={rating} onChange={setRating} />

          <Text style={styles.commentLabel}>
            Deixe um comentário, sugestão ou elogio
          </Text>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Escreva aqui..."
            placeholderTextColor="#9AA3AF"
            style={styles.input}
            multiline
            numberOfLines={5}
            maxLength={500}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.cta, !canSubmit && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>Avaliar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** --- Estilos --- */
const PRIMARY = "#10153B";  // azul do mock
const LIGHT_BG = "#F4F6FA";

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 42,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    //borderRadius: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
  },
  heroCircle: {
    position: "absolute",
    bottom: -28,
    left: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: PRIMARY,
    lineHeight: 30,
  },
  subtitle: {
    color: "#9AA3AF",
    marginTop: 6,
    marginBottom: 18,
    fontSize: 13,
  },
  helper: {
    color: "#111827",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  starBtn: {
    padding: 2,
  },
  commentLabel: {
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    backgroundColor: LIGHT_BG,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  cta: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
