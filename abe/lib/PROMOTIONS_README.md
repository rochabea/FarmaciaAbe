# Sistema de Promoções e Ofertas

Este sistema permite gerenciar produtos em promoção no aplicativo.

## 📋 Estrutura do Banco de Dados

A tabela `products` foi estendida com os seguintes campos:
- `is_promotion` (BOOLEAN): Indica se o produto está em promoção
- `original_price_cents` (INTEGER): Preço original antes da promoção (em centavos)
- `discount_percent` (INTEGER): Percentual de desconto (opcional, calculado automaticamente se não fornecido)

## 🚀 Como Configurar

### 1. Executar o Script SQL

1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute o script `promotions.sql` que está neste diretório

### 2. Marcar Produtos como Promoção

Você pode marcar produtos como promoção de duas formas:

#### Opção A: Via SQL (Supabase Dashboard)
```sql
-- Exemplo: Marcar um produto como promoção
UPDATE products 
SET is_promotion = true, 
    original_price_cents = 2000,  -- R$ 20,00 (preço original)
    price_cents = 1500,            -- R$ 15,00 (preço promocional)
    discount_percent = 25          -- 25% de desconto
WHERE id = 'id-do-produto';
```

#### Opção B: Via Código (para administradores)
```typescript
import { supabase } from '../lib/supabase';

await supabase
  .from('products')
  .update({
    is_promotion: true,
    original_price_cents: 2000,
    price_cents: 1500,
    discount_percent: 25
  })
  .eq('id', 'id-do-produto');
```

## 🔍 Funcionalidades

### Tela de Promoções (`/promo`)
- Mostra apenas produtos com `is_promotion = true`
- Exibe badge com percentual de desconto
- Mostra preço original riscado e preço promocional
- Botão "Comprar" adiciona produto ao carrinho

### Outras Telas de Produtos
- Produtos em promoção exibem badge vermelho com percentual de desconto
- Mostra preço original e preço promocional quando aplicável
- Badge aparece no canto superior direito do card do produto

### Botão Comprar
- Adiciona produto ao carrinho do usuário
- Exibe alerta de sucesso com opção de continuar comprando ou ver carrinho
- Funciona em todas as telas de produtos

## 📱 Como Funciona

1. **Produtos em Promoção**: Apenas produtos com `is_promotion = true` aparecem na tela de promoções
2. **Cálculo de Desconto**: Se `discount_percent` não for fornecido, é calculado automaticamente baseado em `original_price_cents` e `price_cents`
3. **Exibição**: Produtos em promoção mostram:
   - Badge vermelho com percentual de desconto
   - Preço original riscado
   - Preço promocional em destaque

## 🔒 Notas Importantes

- O campo `original_price_cents` deve ser maior que `price_cents` para que a promoção seja exibida
- Se `discount_percent` não for fornecido, será calculado automaticamente
- Para remover uma promoção, defina `is_promotion = false`
- O preço usado no carrinho é sempre `price_cents` (preço atual, que pode ser promocional)

## 📝 Exemplo Completo

```sql
-- Criar uma promoção de 30% de desconto
UPDATE products 
SET is_promotion = true,
    original_price_cents = 10000,  -- R$ 100,00
    price_cents = 7000,             -- R$ 70,00
    discount_percent = 30           -- 30% OFF
WHERE name LIKE '%Aspirina%';
```

## 🎨 Visual

- **Badge de Promoção**: Fundo vermelho (#FF4444) com texto branco
- **Preço Original**: Texto riscado em cinza
- **Preço Promocional**: Texto em negrito e cor destacada

