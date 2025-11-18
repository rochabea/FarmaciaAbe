import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  original_price_cents: number | null;
  is_promotion: boolean | null;
  discount_percent: number | null;
  image_url: string | null;
  requires_prescription: boolean | null;
  has_store_stock: boolean | null;
  created_at: string | null;
};

/**
 * Formata preço em centavos para string no formato R$ X,XX
 */
export function formatPrice(priceCents: number | null | undefined): string {
  if (typeof priceCents !== "number" || priceCents <= 0) return "R$ 0,00";
  return (priceCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Calcula o percentual de desconto baseado nos preços
 */
export function calculateDiscountPercent(
  originalPrice: number,
  currentPrice: number
): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Busca produtos em promoção
 */
export async function fetchPromotionProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price_cents,
      original_price_cents,
      is_promotion,
      discount_percent,
      image_url,
      requires_prescription,
      has_store_stock,
      created_at
    `
    )
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
    .select(
      `
      id,
      name,
      description,
      price_cents,
      original_price_cents,
      is_promotion,
      discount_percent,
      image_url,
      requires_prescription,
      has_store_stock,
      created_at
    `
    )
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
export async function fetchProductsByCategory(
  categoryName: string,
  limit?: number
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price_cents,
      original_price_cents,
      is_promotion,
      discount_percent,
      image_url,
      requires_prescription,
      has_store_stock,
      created_at,
      categories!inner(name)
    `
    )
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

  // remove possíveis duplicados por join
  const rows = (data ?? []) as any[];
  const unique = Array.from(new Map(rows.map((r) => [r.id, r])).values());
  return unique as Product[];
}

/**
 * Busca um produto específico por ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price_cents,
      original_price_cents,
      image_url,
      requires_prescription,
      has_store_stock,
      is_promotion,
      discount_percent,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle(); // retorna null se não encontrar

  if (error) {
    console.error("Erro no fetchProductById:", error);
    throw error;
  }

  return data as Product | null;
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
    .select(
      `
      id,
      name,
      description,
      price_cents,
      original_price_cents,
      is_promotion,
      discount_percent,
      image_url,
      requires_prescription,
      has_store_stock,
      created_at
    `
    )
    .ilike("name", `%${searchTerm.trim()}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }

  return (data || []) as Product[];
}
