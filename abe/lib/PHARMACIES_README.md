# Sistema de Gerenciamento de Farmácias

Este sistema permite gerenciar farmácias cadastradas para retirada de pedidos.

## 📋 Estrutura do Banco de Dados

A tabela `pharmacies` contém os seguintes campos:
- `id` (UUID): Identificador único
- `nome` (VARCHAR): Nome da farmácia
- `endereco` (VARCHAR): Endereço completo
- `cidade` (VARCHAR): Cidade
- `estado` (VARCHAR): Estado (2 caracteres, ex: SP)
- `cep` (VARCHAR): CEP
- `telefone` (VARCHAR, opcional): Telefone de contato
- `distancia` (VARCHAR, opcional): Distância aproximada (ex: "1,2 km")
- `ativo` (BOOLEAN): Se a farmácia está ativa
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização

## 🚀 Como Configurar

### 1. Criar a Tabela no Supabase

1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute o script `pharmacies.sql` que está neste diretório

### 2. Cadastrar Farmácias

Você pode cadastrar farmácias de duas formas:

#### Opção A: Via SQL (Supabase Dashboard)
```sql
INSERT INTO pharmacies (nome, endereco, cidade, estado, cep, telefone, distancia) VALUES
('Drogasil', 'Rua A, 123', 'São Paulo', 'SP', '01234-567', '(11) 1234-5678', '1,2 km'),
('Drogaria São Paulo', 'Rua B, 456', 'São Paulo', 'SP', '01234-568', '(11) 2345-6789', '2,5 km');
```

#### Opção B: Via CSV (Supabase Dashboard)
1. Vá em Table Editor > pharmacies
2. Clique em "Import data from CSV"
3. Use o arquivo `pharmacies_example.csv` como referência

#### Opção C: Via Código (para administradores)
```typescript
import { createPharmacy } from '../lib/pharmacies';

await createPharmacy({
  nome: 'Drogasil',
  endereco: 'Rua A, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
  telefone: '(11) 1234-5678',
  distancia: '1,2 km',
  ativo: true
});
```

## 🔍 Funcionalidades

### Busca de Farmácias
- A busca é feita em tempo real enquanto o usuário digita
- Busca parcial e case-insensitive no nome da farmácia
- Debounce de 300ms para otimizar performance

### Listagem
- Mostra apenas farmácias ativas (`ativo = true`)
- Ordenadas alfabeticamente por nome
- Exibe nome, endereço completo, telefone (se disponível) e distância

## 📱 Uso na Aplicação

Quando o usuário seleciona "Retirada" como forma de entrega:
1. A tela de retirada carrega automaticamente todas as farmácias ativas
2. O usuário pode pesquisar por nome usando o campo de busca
3. O usuário pode ver a lista completa de farmácias
4. Ao selecionar uma farmácia, o usuário continua para a tela de pagamento

## 🔒 Segurança

- Apenas farmácias ativas são exibidas para usuários
- Políticas RLS (Row Level Security) estão configuradas
- Ajuste as políticas conforme necessário para seu sistema de autenticação

## 📝 Notas

- A distância é armazenada como string (ex: "1,2 km") pois pode variar
- O campo `telefone` é opcional
- O campo `distancia` é opcional
- Para desativar uma farmácia, use `updatePharmacy(id, { ativo: false })` ao invés de deletar


