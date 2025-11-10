import { supabase } from "./supabase";

export async function addToCart(cartId: string, productId: string, price_cents: number, qty = 1) {
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, qty")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("cart_items")
      .update({ qty: existing.qty + qty })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      price_cents,
      qty,
    });
  }
}

export async function setQty(itemId: string, qty: number) {
  if (qty <= 0) {
    await supabase.from("cart_items").delete().eq("id", itemId);
  } else {
    await supabase.from("cart_items").update({ qty }).eq("id", itemId);
  }
}
