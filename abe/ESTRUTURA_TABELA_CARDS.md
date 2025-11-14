# Estrutura da Tabela `cards` no Supabase

Para que o sistema de cartões funcione, você precisa criar a seguinte tabela no Supabase:

## SQL para criar a tabela:

```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  holder_name TEXT NOT NULL,
  last_four TEXT NOT NULL, -- últimos 4 dígitos do cartão
  masked_number TEXT NOT NULL, -- número mascarado para exibição (ex: "**** **** **** 1234")
  expiry_month INTEGER,
  expiry_year INTEGER,
  brand TEXT, -- bandeira do cartão (Visa, Mastercard, etc)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar cartões por usuário
CREATE INDEX idx_cards_user_id ON cards(user_id);

-- RLS (Row Level Security) - permite que usuários vejam apenas seus próprios cartões
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver apenas seus próprios cartões
CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários podem inserir apenas seus próprios cartões
CREATE POLICY "Users can insert own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem deletar apenas seus próprios cartões
CREATE POLICY "Users can delete own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);
```

## Observações de Segurança:

⚠️ **IMPORTANTE**: Por questões de segurança, o número completo do cartão NÃO é armazenado. Apenas os últimos 4 dígitos são salvos.

Em produção, você deve:
1. Usar um serviço de tokenização (como Stripe, PagSeguro, etc)
2. Criptografar dados sensíveis antes de salvar
3. Nunca armazenar CVV (código de segurança)
4. Seguir as diretrizes PCI DSS

