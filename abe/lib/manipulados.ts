import { supabase } from "./supabase";

export type ManipuladoStatus = "Pendente" | "Aprovado" | "Rejeitado";

export type Manipulado = {
  id: string;
  user_id: string;
  numero: string;
  paciente: string;
  file_url?: string | null;
  file_name?: string | null;
  status: ManipuladoStatus;
  created_at: string;
  updated_at?: string | null;
  data_aprovacao?: string | null;
  data_rejeicao?: string | null;
};

export type ManipuladoInput = {
  paciente: string;
  file_url: string;
  file_name: string;
};

/**
 * Busca todas as solicitações de manipulados do usuário autenticado
 */
export async function fetchUserManipulados(): Promise<Manipulado[]> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("manipulados")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    // Se a tabela não existir ou não for encontrada, retorna array vazio silenciosamente
    if (
      error.code === "PGRST116" || 
      error.message?.includes("does not exist") ||
      error.message?.includes("schema cache") ||
      error.message?.includes("relation") ||
      error.message?.includes("table") ||
      error.code === "42P01" // PostgreSQL error code for "relation does not exist"
    ) {
      console.warn("Tabela manipulados não encontrada. Retornando array vazio.");
      return [];
    }
    throw error;
  }

  return (data || []) as Manipulado[];
}

/**
 * Cria uma nova solicitação de manipulados
 */
export async function createManipulado(input: ManipuladoInput): Promise<Manipulado> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  // Gera um número único para a solicitação
  const numero = `MAN${Date.now().toString().slice(-8)}`;

  console.log("Tentando inserir manipulado no banco...");
  const { data, error } = await supabase
    .from("manipulados")
    .insert({
      user_id: user.id,
      numero,
      paciente: input.paciente,
      file_url: input.file_url,
      file_name: input.file_name,
      status: "Pendente",
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir manipulado:", error);
    console.error("Código do erro:", error.code);
    console.error("Mensagem do erro:", error.message);
    throw error;
  }
  
  if (!data) {
    console.error("Nenhum dado retornado após inserção");
    throw new Error("Erro ao criar solicitação de manipulados.");
  }

  console.log("Manipulado criado com sucesso:", data.id);
  return data as Manipulado;
}

/**
 * Busca um manipulado específico por ID
 */
export async function fetchManipuladoById(id: string): Promise<Manipulado | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("manipulados")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    // Se a tabela não existir, retorna null silenciosamente
    if (
      error.code === "PGRST116" ||
      error.message?.includes("does not exist") ||
      error.message?.includes("schema cache") ||
      error.message?.includes("relation") ||
      error.message?.includes("table") ||
      error.code === "42P01"
    ) {
      console.warn("Tabela manipulados não encontrada.");
      return null;
    }
    console.error("Erro ao buscar manipulado:", error);
    throw error;
  }

  return data as Manipulado;
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

