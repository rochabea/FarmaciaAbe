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
  Image,
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
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            style={styles.starBtn}
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color="#10153B"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** --- Tela Principal --- */
export default function AvaliacaoScreen() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const canSubmit = rating > 0 || comment.trim().length > 0;

  const handleSubmit = async () => {
    Alert.alert("Obrigado!", "Sua avaliação foi enviada com sucesso.");
    setRating(0);
    setComment("");
    router.replace("/(tabs)/home");
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* HEADER */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(tabs)/home")}>
          <Image
            source={require("../../assets/images/seta-esquerda.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        

        <Text style={styles.topTitle}>Avaliação</Text>

        {/* Ícone centralizado no topo */}
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={40} color="#10153B" />
          <Ionicons
            name="heart"
            size={16}
            color="#10153B"
            style={{ position: "absolute", right: 18, bottom: 14 }}
          />
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageCenter}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** --- Estilos --- */
const PRIMARY = "#242760";
const LIGHT_BG = "#F4F6FA";

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  pageCenter: {
    width: "100%",
    alignItems: "center",
  },

  /* HEADER */
  topRect: {
    width: "100%",
    backgroundColor: PRIMARY,
    paddingTop: 52,
    paddingBottom: 42,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: 16,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  topTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
    textAlign: "center",
  },
  iconCircle: {
    position: "absolute",
    bottom: -32,
    alignSelf: "center", // centraliza horizontalmente
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },

  /* CONTEÚDO */
  container: {
    alignSelf: "center",
    width: "92%",
    maxWidth: 420,
    paddingTop: 48,
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
    color: PRIMARY,
    marginBottom: 10,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 18,
  },
  starBtn: { padding: 2 },
  commentLabel: {
    color: PRIMARY,
    marginBottom: 8,
    textAlign: "center",
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
    alignSelf: "stretch",
  },
  cta: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    alignSelf: "stretch",
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
