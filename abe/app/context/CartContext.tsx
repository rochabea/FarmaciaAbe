import React, { createContext, useContext, useMemo, useReducer } from "react";
export default CartProvider;
export type CartItem = { id: string; name: string; price: number; image?: any; qty: number };
type State = { items: CartItem[] };
type Ctx = State & {
  addItem: (i: CartItem) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<Ctx | undefined>(undefined);

type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "SET_QTY"; payload: { id: string; qty: number } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const e = state.items.find(i => i.id === action.payload.id);
      const items = e
        ? state.items.map(i => i.id === action.payload.id ? { ...i, qty: Math.min(999, i.qty + action.payload.qty) } : i)
        : [...state.items, action.payload];
      return { items };
    }
    case "SET_QTY":
      return { items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i).filter(i => i.qty > 0) };
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.payload.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const value = useMemo<Ctx>(() => {
    const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    return {
      ...state,
      total,
      count,
      addItem: (i) => dispatch({ type: "ADD", payload: i }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }),
      removeItem: (id) => dispatch({ type: "REMOVE", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
