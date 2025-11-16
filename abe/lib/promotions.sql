-- Script SQL para adicionar campos de promoção na tabela products
-- Execute este script no SQL Editor do Supabase

-- Adicionar campos de promoção se não existirem
DO $$ 
BEGIN
  -- Campo para indicar se o produto está em promoção
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_promotion'
  ) THEN
    ALTER TABLE products ADD COLUMN is_promotion BOOLEAN DEFAULT false;
  END IF;

  -- Campo para preço original (antes da promoção)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'original_price_cents'
  ) THEN
    ALTER TABLE products ADD COLUMN original_price_cents INTEGER;
  END IF;

  -- Campo para percentual de desconto (opcional, para exibição)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discount_percent'
  ) THEN
    ALTER TABLE products ADD COLUMN discount_percent INTEGER;
  END IF;
END $$;

-- Criar índice para busca rápida de produtos em promoção
CREATE INDEX IF NOT EXISTS idx_products_is_promotion ON products(is_promotion) WHERE is_promotion = true;

-- Exemplo de como marcar um produto como promoção:
-- UPDATE products 
-- SET is_promotion = true, 
--     original_price_cents = 2000,  -- R$ 20,00
--     price_cents = 1500,            -- R$ 15,00 (preço promocional)
--     discount_percent = 25         -- 25% de desconto
-- WHERE id = 'id-do-produto';

