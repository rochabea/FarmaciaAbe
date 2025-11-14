# Adaptação para Tabela ADDRESS Existente

O código foi atualizado para usar a tabela `address` (singular) ao invés de `addresses`.

## Campos Esperados na Tabela `address`:

O código espera que a tabela tenha os seguintes campos:

- `id` (UUID ou INTEGER) - Identificador único
- `user_id` (UUID) - ID do usuário (referência a auth.users)
- `logradouro` (TEXT) - Rua/Avenida
- `numero` (TEXT) - Número do endereço
- `cep` (TEXT) - CEP
- `cidade` (TEXT) - Cidade
- `estado` (TEXT) - Estado
- `bairro` (TEXT) - Bairro
- `created_at` (TIMESTAMP) - Data de criação (opcional)
- `updated_at` (TIMESTAMP) - Data de atualização (opcional)

## Se os Nomes das Colunas Forem Diferentes:

Se sua tabela `address` tiver nomes de colunas diferentes, você pode:

### Opção 1: Renomear as colunas no código

Edite o arquivo `abe/lib/addresses.ts` e ajuste os nomes dos campos conforme sua tabela.

### Opção 2: Usar aliases no SELECT

Modifique as queries para usar aliases:

```typescript
// Exemplo se sua tabela usa "street" ao invés de "logradouro"
const { data, error } = await supabase
  .from("address")
  .select("id, user_id, street as logradouro, number as numero, ...")
```

## Verificação Rápida:

Execute esta query no Supabase para ver a estrutura da sua tabela:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'address';
```

## Campos Mínimos Necessários:

Para o código funcionar, a tabela precisa ter pelo menos:
- `id`
- `user_id` 
- `logradouro` (ou equivalente)
- `numero` (ou equivalente)
- `cep` (ou equivalente)
- `cidade` (ou equivalente)
- `estado` (ou equivalente)
- `bairro` (ou equivalente)

Se algum campo tiver nome diferente, me informe e eu ajusto o código!

