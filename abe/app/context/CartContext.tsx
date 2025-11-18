import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  addToCart,
  fetchCartWithItems,
  setItemQty,
  removeItem as removeCartItem,
} from "../../lib/cart";

export type CartItem = {
  id: string;           // id do cart_item no banco
  productId: string;    // id do produto
  name: string;
  price: number;        // em reais
  qty: number;
  image?: any;
  image_url?: string | null;
  requires_prescription?: boolean; // 👈 FLAG DE RECEITA
};

type State = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
};

type Ctx = State & {
  addItem: (productId: string, qty: number) => Promise<void>;
  setQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  total: number;
  count: number;
};

const CartContext = createContext<Ctx | undefined>(undefined);

type Action =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { id: string; qty: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
          )
          .filter((i) => i.qty > 0),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    loading: true,
    error: null,
  });

  // Carrega itens do carrinho ao inicializar
  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // 👇 Aqui vem os itens do Supabase (via lib/cart)
      const { items: dbItems, subtotalCents } = await fetchCartWithItems();

      const cartItems: CartItem[] = dbItems.map((item) => {
        const priceCents = item.products?.price_cents ?? 0;
        const price = priceCents / 100; // converte centavos para reais
        const qty = item.quantity || 0;

        console.log(
          `Item: ${item.products?.name}, Preço: R$ ${price}, Quantidade: ${qty}, Total: R$ ${(price * qty).toFixed(2)}`
        );

        return {
          id: item.id,
          productId: item.product_id,
          name: item.products?.name || "Produto sem nome",
          price,
          qty,
          image_url: item.products?.image_url || null,
          // 👇 PEGANDO A INFO DE RECEITA DO PRODUTO
          requires_prescription:
            (item.products as any)?.requires_prescription ?? false,
        };
      });

      dispatch({ type: "SET_ITEMS", payload: cartItems });
    } catch (error: any) {
      console.error("Erro ao carregar carrinho:", error);
      if (
        error.message?.includes("não autenticado") ||
        error.message?.includes("autenticado")
      ) {
        dispatch({
          type: "SET_ERROR",
          payload: "Você precisa estar logado para ver o carrinho",
        });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Erro ao carregar carrinho",
        });
      }
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const value = useMemo<Ctx>(() => {
    const total = state.items.reduce((s, i) => {
      const itemTotal = (i.price || 0) * (i.qty || 0);
      console.log(
        `Calculando total: Item ${i.name} - Preço: ${i.price}, Qty: ${i.qty}, Subtotal: ${itemTotal}, Total acumulado: ${
          s + itemTotal
        }`
      );
      return s + itemTotal;
    }, 0);

    const count = state.items.reduce((s, i) => s + (i.qty || 0), 0);

    console.log(
      `Total do carrinho: R$ ${total.toFixed(2)}, Total de itens: ${count}`
    );

    return {
      ...state,
      total,
      count,
      addItem: async (productId: string, qty: number) => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          await addToCart(productId, qty);
          await new Promise((resolve) => setTimeout(resolve, 200));
          await loadCart();
        } catch (error: any) {
          dispatch({
            type: "SET_ERROR",
            payload: error.message || "Erro ao adicionar item",
          });
          throw error;
        }
      },
      setQty: async (itemId: string, qty: number) => {
        try {
          await setItemQty(itemId, qty);
          await loadCart();
        } catch (error: any) {
          dispatch({
            type: "SET_ERROR",
            payload: error.message || "Erro ao atualizar quantidade",
          });
          throw error;
        }
      },
      removeItem: async (itemId: string) => {
        try {
          await removeCartItem(itemId);
          await loadCart();
        } catch (error: any) {
          dispatch({
            type: "SET_ERROR",
            payload: error.message || "Erro ao remover item",
          });
          throw error;
        }
      },
      clear: async () => {
        try {
          for (const item of state.items) {
            await removeCartItem(item.id);
          }
          await loadCart();
        } catch (error: any) {
          dispatch({
            type: "SET_ERROR",
            payload: error.message || "Erro ao limpar carrinho",
          });
          throw error;
        }
      },
      refresh: loadCart,
    };
  }, [state, loadCart]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

export default CartProvider;
