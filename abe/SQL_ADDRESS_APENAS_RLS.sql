-- ============================================
-- SQL APENAS PARA POLÍTICAS RLS
-- Use este arquivo se a tabela ADDRESS já existe
-- ============================================

-- 1. Habilita Row Level Security (RLS) se ainda não estiver habilitado
ALTER TABLE address ENABLE ROW LEVEL SECURITY;

-- 2. Remove políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Users can view own addresses" ON address;
DROP POLICY IF EXISTS "Users can insert own addresses" ON address;
DROP POLICY IF EXISTS "Users can update own addresses" ON address;
DROP POLICY IF EXISTS "Users can delete own addresses" ON address;

-- 3. Cria política: usuários podem ver apenas seus próprios endereços
CREATE POLICY "Users can view own addresses"
  ON address FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Cria política: usuários podem inserir apenas seus próprios endereços
CREATE POLICY "Users can insert own addresses"
  ON address FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Cria política: usuários podem atualizar apenas seus próprios endereços
CREATE POLICY "Users can update own addresses"
  ON address FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Cria política: usuários podem deletar apenas seus próprios endereços
CREATE POLICY "Users can delete own addresses"
  ON address FOR DELETE
  USING (auth.uid() = user_id);

