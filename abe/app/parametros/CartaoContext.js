import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchUserCards, createCard, deleteCard, cardToContextFormat } from '../../lib/cards';
import { supabase } from '../../lib/supabase';

export default CartaoProvider;
export const CartaoContext = createContext();

export function CartaoProvider({ children }) {
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega cartões do banco
  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setCartoes([]);
        setLoading(false);
        return;
      }

      const cards = await fetchUserCards();
      const formattedCards = cards.map(cardToContextFormat);
      setCartoes(formattedCards);
    } catch (err) {
      console.error('Erro ao carregar cartões:', err);
      setError(err.message || 'Erro ao carregar cartões');
      setCartoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega cartões ao montar o componente
  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Adiciona um novo cartão
  const adicionarCartao = async ({ nome, numero, codigo, vencimento, bandeira }) => {
    try {
      setError(null);
      
      // Extrai mês e ano do vencimento (formato MM/AA)
      let expiryMonth = null;
      let expiryYear = null;
      if (vencimento) {
        const [month, year] = vencimento.split('/');
        expiryMonth = month ? parseInt(month, 10) : null;
        expiryYear = year ? 2000 + parseInt(year, 10) : null; // Assume anos 2000+
      }

      await createCard({
        holder_name: nome,
        card_number: numero.replace(/\s+/g, ''), // Remove espaços
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        brand: bandeira,
      });

      // Recarrega a lista de cartões
      await loadCards();
    } catch (err) {
      console.error('Erro ao adicionar cartão:', err);
      setError(err.message || 'Erro ao adicionar cartão');
      throw err;
    }
  };

  // Remove um cartão
  const removerCartao = async (cardId) => {
    try {
      setError(null);
      await deleteCard(cardId);
      await loadCards();
    } catch (err) {
      console.error('Erro ao remover cartão:', err);
      setError(err.message || 'Erro ao remover cartão');
      throw err;
    }
  };

  return (
    <CartaoContext.Provider value={{ 
      cartoes, 
      adicionarCartao, 
      removerCartao,
      loadCards,
      loading,
      error 
    }}>
      {children}
    </CartaoContext.Provider>
  );
}
