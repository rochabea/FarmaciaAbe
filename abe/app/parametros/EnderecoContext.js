import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchUserAddresses, createAddress, deleteAddress, addressToContextFormat } from '../../lib/addresses';
import { supabase } from '../../lib/supabase';

export default EnderecoProvider;
export const EnderecoContext = createContext();

export function EnderecoProvider({ children }) {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const addresses = await fetchUserAddresses();
      const formatted = addresses.map(addressToContextFormat);
      setEnderecos(formatted);
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
      setError(err.message);
      setEnderecos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        loadAddresses();
      } else if (event === 'SIGNED_OUT') {
        setEnderecos([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadAddresses]);

  const adicionarEndereco = async (endereco) => {
    try {
      setLoading(true);
      const newAddress = await createAddress({
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        cep: endereco.cep,
        cidade: endereco.cidade,
        estado: endereco.estado,
        bairro: endereco.bairro,
      });
      const formatted = addressToContextFormat(newAddress);
      setEnderecos((prev) => [formatted, ...prev]);
      return newAddress;
    } catch (err) {
      console.error('Erro ao adicionar endereço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerEndereco = async (id) => {
    try {
      setLoading(true);
      await deleteAddress(String(id));
      setEnderecos((prev) => prev.filter((e) => String(e.id) !== String(id)));
    } catch (err) {
      console.error('Erro ao remover endereço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnderecoContext.Provider
      value={{
        enderecos,
        loading,
        error,
        adicionarEndereco,
        removerEndereco,
        refresh: loadAddresses,
      }}
    >
      {children}
    </EnderecoContext.Provider>
  );
}


