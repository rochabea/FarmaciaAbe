import React, { createContext, useState } from 'react';

export const CartaoContext = createContext();

export function CartaoProvider({ children }) {
  const [cartoes, setCartoes] = useState([
    { id: 1, nome: 'Ana Beatriz', numero: '**** **** **** 1234' },
    { id: 2, nome: 'Ana Beatriz', numero: '**** **** **** 5678' },
  ]);

  const adicionarCartao = ({ nome, numero, codigo, vencimento, bandeira }) => {
    const ultimos4 = numero.slice(-4);
    const numeroMascarado = '**** **** **** ' + ultimos4;
    setCartoes([...cartoes, { id: Date.now(), nome, numero: numeroMascarado, codigo, vencimento, bandeira }]);
  };

  return (
    <CartaoContext.Provider value={{ cartoes, adicionarCartao }}>
      {children}
    </CartaoContext.Provider>
  );
}
