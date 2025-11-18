import { supabase } from "./supabase";

export type Card = {
  id: string;
  user_id: string;
  holder_name: string;
  last_four: string; // últimos 4 dígitos
  masked_number: string; // número mascarado para exibição
  expiry_month?: number | null;
  expiry_year?: number | null;
  brand?: string | null; // bandeira (Visa, Mastercard, etc)
  created_at: string;
};

/**
 * Busca todos os cartões do usuário autenticado
 */
export async function fetchUserCards(): Promise<Card[]> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Card[];
}

/**
 * Cria um novo cartão para o usuário
 * O número completo é armazenado de forma segura (você pode criptografar depois)
 * Mas para exibição, apenas os últimos 4 dígitos são mostrados
 */
export async function createCard(data: {
  holder_name: string;
  card_number: string; // número completo (será mascarado)
  expiry_month?: number;
  expiry_year?: number;
  brand?: string;
}): Promise<Card> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  // Extrai os últimos 4 dígitos
  const lastFour = data.card_number.slice(-4);
  const maskedNumber = `**** **** **** ${lastFour}`;

  // Remove espaços e caracteres não numéricos do número completo
  const cleanNumber = data.card_number.replace(/\s+/g, "");

  const { data: card, error } = await supabase
    .from("cards")
    .insert({
      user_id: user.id,
      holder_name: data.holder_name,
      last_four: lastFour,
      masked_number: maskedNumber,
      // Em produção, você deve criptografar o número completo antes de salvar
      // Por enquanto, vamos salvar apenas os últimos 4 dígitos por segurança
      expiry_month: data.expiry_month || null,
      expiry_year: data.expiry_year || null,
      brand: data.brand || null,
    })
    .select()
    .single();

  if (error) throw error;
  return card as Card;
}

/**
 * Remove um cartão
 */
export async function deleteCard(cardId: string): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", user.id); // Garante que só deleta cartões do próprio usuário

  if (error) throw error;
}

/**
 * Converte um Card do banco para o formato usado no contexto
 */
export function cardToContextFormat(card: Card) {
  return {
    id: card.id,
    nome: card.holder_name,
    numero: card.masked_number,
    vencimento: card.expiry_month && card.expiry_year
      ? `${String(card.expiry_month).padStart(2, '0')}/${String(card.expiry_year).slice(-2)}`
      : undefined,
    bandeira: card.brand || undefined,
  };
}


