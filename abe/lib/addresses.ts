import { supabase } from "./supabase";

export type Address = {
  id: string;
  user_id: string;
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  created_at: string;
  updated_at: string;
};

export type AddressInput = {
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
};

/**
 * Busca todos os endereços do usuário autenticado
 */
export async function fetchUserAddresses(): Promise<Address[]> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  // Busca endereços - tenta ordenar por created_at, se não existir ordena por id
  const { data, error } = await supabase
    .from("address")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    // Se der erro por causa do created_at, tenta sem ordenação ou por id
    if (error.message?.includes("created_at")) {
      const { data: dataRetry, error: errorRetry } = await supabase
        .from("address")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });
      
      if (errorRetry) throw errorRetry;
      return (dataRetry || []) as Address[];
    }
    throw error;
  }
  
  return (data || []) as Address[];
}

/**
 * Cria um novo endereço para o usuário autenticado
 */
export async function createAddress(address: AddressInput): Promise<Address> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("address")
    .insert({
      user_id: user.id,
      ...address,
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Erro ao criar endereço.");
  return data as Address;
}

/**
 * Remove um endereço do usuário
 */
export async function deleteAddress(addressId: string): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { error } = await supabase
    .from("address")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id); // Garante que só deleta endereços do próprio usuário

  if (error) throw error;
}

/**
 * Converte um endereço do banco para o formato usado no contexto
 */
export function addressToContextFormat(address: Address): {
  id: string | number;
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
} {
  return {
    id: address.id,
    logradouro: address.logradouro,
    numero: address.numero,
    cep: address.cep,
    cidade: address.cidade,
    estado: address.estado,
    bairro: address.bairro,
  };
}

