import React, { useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { CartaoContext } from "./parametros/CartaoContext";
import { Picker } from "@react-native-picker/picker";

// -------------------------
// Helpers de formatação
// -------------------------

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D+/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
};

const formatExpiry = (value: string) => {
  const cleaned = value.replace(/\D+/g, "");
  if (cleaned.length <= 2) return cleaned;
  return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
};

const isValidMonth = (mm: string) => {
  const m = Number(mm);
  return m >= 1 && m <= 12;
};

// -------------------------
// Detecção de bandeira (BIN/IIN)
// -------------------------
type BandeiraKey =
  | ""
  | "visa"
  | "mastercard"
  | "elo"
  | "amex";

const detectBrand = (cardNumber: string): BandeiraKey => {
  const n = cardNumber.replace(/\D+/g, "");

  if (!n) return "";

  // Visa: começa com 4
  if (/^4\d{0,}$/.test(n)) return "visa";

  // MasterCard: 51–55 ou 2221–2720
  if (
    /^(5[1-5]\d{0,}|22(2[1-9]|[3-9]\d)\d{0,}|2[3-6]\d{0,}|27(0\d|1\d|20)\d{0,})$/.test(
      n
    )
  )
    return "mastercard";

  // Amex: 34 ou 37
  if (/^3[47]\d{0,}$/.test(n)) return "amex";

  // Elo (aproximação BINs mais comuns)
  if (
    /^(4011(78|79)|431274|438935|451416|457393|457631|457632|504175|5067|5090|627780|636297|636368|6500|6504|6505|6509|6516|6550)\d{0,}$/.test(
      n
    )
  )
    return "elo";

  return "";
};

// -------------------------
// Ícones fixos por bandeira
// -------------------------
const brandIcons: Record<BandeiraKey, any> = {
  "": null,
  visa: require("../assets/images/bandeiras/visa.jpg"),
  mastercard: require("../assets/images/bandeiras/mastercard.jpg"),
  elo: require("../assets/images/bandeiras/elo.png"),
  amex: require("../assets/images/bandeiras/amex.png"),
};

const brandLabels: Record<BandeiraKey, string> = {
  "": "Selecione a bandeira",
  visa: "Visa",
  mastercard: "MasterCard",
  elo: "Elo",
  amex: "American Express",
};

export default function NovoCartao() {
  const router = useRouter();
  const { adicionarCartao } = useContext(CartaoContext);

  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [codigo, setCodigo] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [bandeira, setBandeira] = useState<BandeiraKey>("");

  // quando true, não sobrescreve bandeira via auto-detecção
  const [bandeiraManual, setBandeiraManual] = useState(false);

  // modal iOS
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // bandeira detectada a partir do número
  const bandeiraDetectada = useMemo(() => detectBrand(numero), [numero]);

  // em tempo real: se não foi escolhida manualmente, usa a detectada
  React.useEffect(() => {
    if (!bandeiraManual) setBandeira(bandeiraDetectada);
  }, [bandeiraDetectada, bandeiraManual]);

  const handleAdicionar = async () => {
    const nomeClean = nome.trim();
    const numeroClean = numero.replace(/\s+/g, "");
    const codigoClean = codigo.trim();
    const vencClean = vencimento.trim();

    if (!nomeClean) {
      setError("Nome do titular é obrigatório");
      return;
    }
    if (!numeroClean || numeroClean.length < 13) {
      setError("Número do cartão inválido");
      return;
    }
    if (!codigoClean || codigoClean.length < 3) {
      setError("Código de segurança inválido");
      return;
    }
    if (!vencClean || vencClean.length !== 5) {
      setError("Vencimento inválido. Use MM/AA.");
      return;
    }
    const [mm] = vencClean.split("/");
    if (!isValidMonth(mm)) {
      setError("Mês de vencimento inválido");
      return;
    }
    if (!bandeira) {
      setError("Bandeira não identificada. Selecione manualmente.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await adicionarCartao({
        nome: nomeClean,
        numero: numeroClean,
        codigo: codigoClean,
        vencimento: vencClean,
        bandeira,
      });

      router.back();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar cartão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Topo */}
        <View style={styles.topRect}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image
              source={require("../assets/images/seta-esquerda.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Novo Cartão</Text>

          <View style={styles.iconCircle}>
            <Image
              source={require("../assets/images/cartao-de-credito.png")}
              style={styles.cartIcon}
            />
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.mainTitle}>Complete com os dados do cartão</Text>

          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Nome do titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          {/* Número com ícone da bandeira */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Número do cartão</Text>

            <View style={styles.cardRow}>
              <TextInput
                style={[styles.input, styles.cardInput]}
                placeholder="0000 0000 0000 0000"
                value={numero}
                onChangeText={(text) => {
                  setNumero(formatCardNumber(text));
                  if (text.replace(/\D+/g, "").length === 0) {
                    setBandeiraManual(false);
                  }
                }}
                keyboardType="numeric"
                maxLength={19}
              />

              {!!bandeiraDetectada && brandIcons[bandeiraDetectada] && (
                <View style={styles.brandIconBox}>
                  <Image
                    source={brandIcons[bandeiraDetectada]}
                    style={styles.brandIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>

            {!!bandeiraDetectada && (
              <Text style={styles.detectedLabel}>
                Bandeira detectada:{" "}
                <Text style={{ fontWeight: "700" }}>
                  {brandLabels[bandeiraDetectada]}
                </Text>
              </Text>
            )}
          </View>

          {/* CVC */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Código de segurança</Text>
            <TextInput
              style={styles.input}
              placeholder="000"
              value={codigo}
              onChangeText={(text) => setCodigo(text.replace(/\D+/g, ""))}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>

          {/* Vencimento */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              value={vencimento}
              onChangeText={(text) => setVencimento(formatExpiry(text))}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          {/* Bandeira */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Bandeira</Text>

            {Platform.OS === "ios" ? (
              <>
                {/* Botão que abre modal */}
                <TouchableOpacity
                  style={styles.iosPickerButton}
                  onPress={() => setIosPickerOpen(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iosPickerButtonText}>
                    {brandLabels[bandeira]}
                  </Text>
                </TouchableOpacity>

                {/* Modal com roleta */}
                <Modal
                  visible={iosPickerOpen}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setIosPickerOpen(false)}
                >
                  <Pressable
                    style={styles.iosModalOverlay}
                    onPress={() => setIosPickerOpen(false)}
                  >
                    <Pressable style={styles.iosModalContent}>
                      <View style={styles.iosModalHeader}>
                        <TouchableOpacity onPress={() => setIosPickerOpen(false)}>
                          <Text style={styles.iosModalCancel}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIosPickerOpen(false)}>
                          <Text style={styles.iosModalDone}>OK</Text>
                        </TouchableOpacity>
                      </View>

                      <Picker
                        selectedValue={bandeira}
                        onValueChange={(value) => {
                          setBandeiraManual(true);
                          setBandeira(value);
                        }}
                        style={{ height: 220 }}
                      >
                        <Picker.Item label="Selecione a bandeira" value="" />
                        <Picker.Item label="Visa" value="visa" />
                        <Picker.Item label="MasterCard" value="mastercard" />
                        <Picker.Item label="Elo" value="elo" />
                        <Picker.Item label="American Express" value="amex" />
                      </Picker>
                    </Pressable>
                  </Pressable>
                </Modal>
              </>
            ) : (
              <View style={styles.pickerContainerAndroid}>
                <Picker
                  selectedValue={bandeira}
                  onValueChange={(value) => {
                    setBandeiraManual(true);
                    setBandeira(value);
                  }}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Selecione a bandeira" value="" />
                  <Picker.Item label="Visa" value="visa" />
                  <Picker.Item label="MasterCard" value="mastercard" />
                  <Picker.Item label="Elo" value="elo" />
                  <Picker.Item label="American Express" value="amex" />
                </Picker>
              </View>
            )}

            {bandeiraManual && (
              <TouchableOpacity
                onPress={() => setBandeiraManual(false)}
                style={styles.resetAutoBtn}
              >
                <Text style={styles.resetAutoText}>
                  Voltar para detecção automática
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Erro */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Botão */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleAdicionar}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Adicionando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Adicionar Cartão</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// -------------------------
// Styles
// -------------------------
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  topRect: {
    width: "100%",
    height: 180,
    backgroundColor: "#242760",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: 50,
  },

  topTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -60,
    borderWidth: 3,
    borderColor: "#fff",
  },

  cartIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  formContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  mainTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242760",
    marginBottom: 20,
    textAlign: "left",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },

  labelBlack: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 5,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  // Número + ícone
  cardRow: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },

  cardInput: {
    paddingRight: 60,
  },

  brandIconBox: {
    position: "absolute",
    right: 12,
    height: 50,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  brandIcon: {
    width: 36,
    height: 24,
  },

  detectedLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#242760",
  },

  // Android Picker
  pickerContainerAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  picker: {
    height: 50,
    width: "100%",
  },

  // iOS fake dropdown button
  iosPickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: "#000",
  },

  // iOS modal
  iosModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  iosModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 10,
  },
  iosModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iosModalCancel: {
    fontSize: 16,
    color: "#666",
  },
  iosModalDone: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242760",
  },

  resetAutoBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F4F4F7",
    borderRadius: 8,
  },

  resetAutoText: {
    fontSize: 12,
    color: "#242760",
    fontWeight: "600",
  },

  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#242760",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
});
