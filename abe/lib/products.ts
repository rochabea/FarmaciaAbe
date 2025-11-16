import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  price_cents: number | null;
  original_price_cents?: number | null;
  is_promotion?: boolean;
  discount_percent?: number | null;
  image_url?: string | null;
  created_at?: string;
};

/**
 * Busca produtos em promoção
 */
export async function fetchPromotionProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cents, original_price_cents, is_promotion, discount_percent, image_url, created_at")
    .eq("is_promotion", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos em promoção:", error);
    throw error;
  }

  return (data || []) as Product[];
}

/**
 * Busca todos os produtos (com informação de promoção)
 */
export async function fetchAllProducts(limit?: number): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("id, name, price_cents, original_price_cents, is_promotion, discount_percent, image_url, created_at")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }

  return (data || []) as Product[];
}

/**
 * Busca produtos por categoria (com informação de promoção)
 */
export async function fetchProductsByCategory(categoryName: string, limit?: number): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("id, name, price_cents, original_price_cents, is_promotion, discount_percent, image_url, created_at, categories!inner(name)")
    .eq("categories.name", categoryName)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    throw error;
  }

  const rows = (data ?? []) as any[];
  const unique = Array.from(new Map(rows.map((r) => [r.id, r])).values());
  return unique as Product[];
}

/**
 * Calcula o percentual de desconto baseado nos preços
 */
export function calculateDiscountPercent(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Busca um produto específico por ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cents, original_price_cents, is_promotion, discount_percent, image_url, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Nenhum resultado encontrado
      return null;
    }
    console.error("Erro ao buscar produto:", error);
    throw error;
  }

  return data as Product;
}

/**
 * Busca produtos por termo de pesquisa (busca no nome do produto)
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cents, original_price_cents, is_promotion, discount_percent, image_url, created_at")
    .ilike("name", `%${searchTerm.trim()}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }

  return (data || []) as Product[];
}

/**
 * Formata preço em centavos para string R$ X,XX
 */
export function formatPrice(priceCents: number | null | undefined): string {
  if (typeof priceCents !== "number" || priceCents <= 0) return "R$ 0,00";
  return `R$ ${(priceCents / 100).toFixed(2).replace(".", ",")}`;
}


