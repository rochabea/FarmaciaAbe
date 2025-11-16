import { supabase } from "./supabase";

export type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price_cents: number | null;
    image_url: string | null;
  } | null;
};

export type Order = {
  id: string;
  user_id: string;
  created_at: string;
  status: string | null;
  total_cents: number | null;
  delivery_type?: string | null; // 'entrega' ou 'retirada' (opcional)
  order_items: OrderItem[];
};

/**
 * Busca todos os pedidos do usuário autenticado
 */
export async function fetchUserOrders(): Promise<Order[]> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      created_at,
      status,
      total_cents,
      order_items (
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          price_cents,
          image_url
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

/**
 * Formata a data para exibição
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Cria um pedido a partir dos itens do carrinho
 */
export async function createOrder(
  totalCents: number,
  deliveryType?: 'entrega' | 'retirada'
): Promise<string> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  // Busca o carrinho do usuário
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (cartError) throw cartError;
  if (!cart) throw new Error("Carrinho não encontrado.");

  // Busca os itens do carrinho
  const { data: cartItems, error: itemsError } = await supabase
    .from("cart_items")
    .select(`
      id,
      product_id,
      quantity,
      products (
        id,
        price_cents
      )
    `)
    .eq("cart_id", cart.id);

  if (itemsError) throw itemsError;
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  // Cria o pedido
  const orderData: any = {
    user_id: user.id,
    total_cents: totalCents,
    status: "pendente",
  };
  
  // Nota: delivery_type foi removido pois a coluna não existe na tabela orders
  // Se precisar dessa informação no futuro, adicione a coluna no banco de dados primeiro
  
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select("id")
    .single();

  if (orderError) throw orderError;
  if (!order) throw new Error("Erro ao criar pedido.");

  // Cria os itens do pedido
  const orderItemsData = cartItems.map((item) => {
    const priceCents = item.products?.price_cents;
    if (!priceCents) {
      throw new Error(`Preço não encontrado para o produto ${item.product_id}`);
    }
    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_cents: priceCents,
    };
  });

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (orderItemsError) {
    // Se der erro ao criar os itens, tenta deletar o pedido criado
    await supabase.from("orders").delete().eq("id", order.id);
    throw orderItemsError;
  }

  // Limpa o carrinho após criar o pedido
  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (clearError) {
    console.error("Erro ao limpar carrinho:", clearError);
    // Não lança erro aqui, pois o pedido já foi criado
  }

  return order.id;
}

