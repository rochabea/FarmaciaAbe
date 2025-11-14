-- ============================================
-- SQL COMPLETO PARA CRIAR A TABELA ADDRESS
-- ============================================

-- 1. Cria a tabela address
CREATE TABLE IF NOT EXISTS address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  cep TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  bairro TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cria índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_address_user_id ON address(user_id);
CREATE INDEX IF NOT EXISTS idx_address_created_at ON address(created_at);

-- 3. Habilita Row Level Security (RLS)
ALTER TABLE address ENABLE ROW LEVEL SECURITY;

-- 4. Remove políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Users can view own addresses" ON address;
DROP POLICY IF EXISTS "Users can insert own addresses" ON address;
DROP POLICY IF EXISTS "Users can update own addresses" ON address;
DROP POLICY IF EXISTS "Users can delete own addresses" ON address;

-- 5. Cria política: usuários podem ver apenas seus próprios endereços
CREATE POLICY "Users can view own addresses"
  ON address FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Cria política: usuários podem inserir apenas seus próprios endereços
CREATE POLICY "Users can insert own addresses"
  ON address FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Cria política: usuários podem atualizar apenas seus próprios endereços
CREATE POLICY "Users can update own addresses"
  ON address FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. Cria política: usuários podem deletar apenas seus próprios endereços
CREATE POLICY "Users can delete own addresses"
  ON address FOR DELETE
  USING (auth.uid() = user_id);

-- 9. (Opcional) Cria função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. (Opcional) Cria trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_address_updated_at ON address;
CREATE TRIGGER update_address_updated_at
  BEFORE UPDATE ON address
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICAÇÃO (Execute após criar a tabela)
-- ============================================

-- Verifica se a tabela foi criada corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'address'
ORDER BY ordinal_position;

-- Verifica as políticas RLS criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'address';

