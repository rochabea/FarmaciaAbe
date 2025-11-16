import { supabase } from "./supabase";

export type Pharmacy = {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string | null;
  distancia?: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type PharmacyInput = {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string | null;
  distancia?: string | null;
  ativo?: boolean;
};

/**
 * Busca todas as drogarias ativas cadastradas
 */
export async function fetchPharmacies(): Promise<Pharmacy[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) {
    // Se a tabela não existir, retorna array vazio ao invés de lançar erro
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn("Tabela pharmacies não encontrada. Execute o script SQL para criar a tabela.");
      return [];
    }
    console.error("Erro ao buscar drogarias:", error);
    throw error;
  }

  return (data || []) as Pharmacy[];
}

/**
 * Busca drogarias por nome (busca parcial, case-insensitive)
 */
export async function searchPharmacies(searchTerm: string): Promise<Pharmacy[]> {
  if (!searchTerm || searchTerm.trim() === "") {
    return fetchPharmacies();
  }

  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("ativo", true)
    .ilike("nome", `%${searchTerm.trim()}%`)
    .order("nome", { ascending: true });

  if (error) {
    // Se a tabela não existir, retorna array vazio ao invés de lançar erro
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn("Tabela pharmacies não encontrada. Execute o script SQL para criar a tabela.");
      return [];
    }
    console.error("Erro ao buscar drogarias:", error);
    throw error;
  }

  return (data || []) as Pharmacy[];
}

/**
 * Busca uma drogaria específica por ID
 */
export async function fetchPharmacyById(id: string): Promise<Pharmacy | null> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("id", id)
    .eq("ativo", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Nenhum resultado encontrado
      return null;
    }
    console.error("Erro ao buscar drogaria:", error);
    throw error;
  }

  return data as Pharmacy;
}

/**
 * Cria uma nova drogaria (apenas para administradores)
 */
export async function createPharmacy(pharmacy: PharmacyInput): Promise<Pharmacy> {
  const { data, error } = await supabase
    .from("pharmacies")
    .insert({
      ...pharmacy,
      ativo: pharmacy.ativo ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Erro ao criar drogaria.");
  return data as Pharmacy;
}

/**
 * Atualiza uma drogaria (apenas para administradores)
 */
export async function updatePharmacy(id: string, pharmacy: Partial<PharmacyInput>): Promise<Pharmacy> {
  const { data, error } = await supabase
    .from("pharmacies")
    .update(pharmacy)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Erro ao atualizar drogaria.");
  return data as Pharmacy;
}

/**
 * Remove uma drogaria (soft delete - marca como inativa)
 */
export async function deletePharmacy(id: string): Promise<void> {
  const { error } = await supabase
    .from("pharmacies")
    .update({ ativo: false })
    .eq("id", id);

  if (error) throw error;
}

