// lib/cart.ts
import { supabase } from './supabase';

type DbProduct = {
  id: string;
  name: string;
  image_url?: string | null;
  price_cents?: number | null; // redundância opcional
};

type DbCartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number; // nome da coluna no Supabase
  products: DbProduct | null; // preço vem da tabela products
};

/** Garante que o usuário tenha um carrinho e retorna o id */
async function ensureCartId(): Promise<string> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error('Usuário não autenticado.');

  // tenta pegar carrinho existente
  const { data: existing, error: selErr } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing?.id) return existing.id;

  // cria se não existir
  const { data: created, error: insErr } = await supabase
    .from('carts')
    .insert({ user_id: user.id })
    .select('id')
    .single();

  if (insErr) throw insErr;
  return created.id;
}

/** Busca itens do carrinho + subtotal em centavos */
export async function fetchCartWithItems(): Promise<{ items: DbCartItem[]; subtotalCents: number }> {
  const cartId = await ensureCartId();

  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
        id,
        cart_id,
        product_id,
        quantity,
        products:products ( id, name, image_url, price_cents )
      `
    )
    .eq('cart_id', cartId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const items = (data ?? []) as unknown as DbCartItem[];
  const subtotalCents = items.reduce((acc, it) => {
    const priceCents = it.products?.price_cents ?? 0;
    return acc + priceCents * it.quantity;
  }, 0);

  return { items, subtotalCents };
}

/** Define quantidade do item. Se qty <= 0, remove. */
export async function setItemQty(itemId: string, qty: number): Promise<void> {
  if (qty <= 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('cart_items').update({ quantity: qty }).eq('id', itemId);
  if (error) throw error;
}

/** Remove um item do carrinho */
export async function removeItem(itemId: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
  if (error) throw error;
}

/** Adiciona produto ao carrinho (aumenta qty se já existir) */
export async function addToCart(productId: string, qty = 1): Promise<void> {
  const cartId = await ensureCartId();

  // pegue o preço atual do produto
  const { data: prod, error: prodErr } = await supabase
    .from('products')
    .select('id, price_cents')
    .eq('id', productId)
    .maybeSingle();

  if (prodErr) throw prodErr;
  if (!prod) throw new Error('Produto não encontrado.');

  // existe item?
  const { data: existing, error: existErr } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existErr) throw existErr;

  if (existing?.id) {
    const { error: upErr } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + qty })
      .eq('id', existing.id);
    if (upErr) throw upErr;
  } else {
    // Insere sem price_cents, pois o preço será buscado da tabela products
    const { error: insErr } = await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      quantity: qty,
    });
    if (insErr) throw insErr;
  }
}

/** Export default também (evita “is not a function” se import default for usado) */
export default {
  fetchCartWithItems,
  setItemQty,
  removeItem,
  addToCart,
};
