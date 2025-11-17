# Configuração do Supabase Auth para Cadastro Automático

## Problema
Por padrão, o Supabase Auth exige confirmação de email antes que o usuário possa fazer login. Isso significa que após o cadastro, o usuário precisa verificar o email antes de poder acessar o app.

## Solução 1: Auto-confirmar emails (Recomendado para desenvolvimento)

Se você quer que os usuários sejam logados automaticamente após o cadastro (sem precisar confirmar email), siga estes passos:

### No Painel do Supabase:

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Settings** (ou **Configurações**)
4. Na seção **Email Auth**, encontre a opção **"Enable email confirmations"**
5. **Desative** essa opção (marque como desabilitada)
6. Salve as alterações

**Atenção**: Desabilitar a confirmação de email reduz a segurança. Use apenas em desenvolvimento ou se você tiver outra forma de verificar emails.

## Solução 2: Manter confirmação de email (Recomendado para produção)

Se você quer manter a confirmação de email (mais seguro):

1. Mantenha a opção **"Enable email confirmations"** **ativada** no Supabase
2. O código já está preparado para lidar com isso:
   - Se o email for auto-confirmado → usuário é logado automaticamente e vai para home
   - Se o email precisar ser confirmado → usuário recebe mensagem para verificar o email e é redirecionado para login

## Como o código funciona agora:

O código verifica automaticamente se uma sessão foi criada após o cadastro:

- **Se houver sessão** → Usuário é logado automaticamente e redirecionado para `/(tabs)/home`
- **Se não houver sessão** → Usuário recebe mensagem para verificar o email e é redirecionado para `/login`

## Testando:

1. **Com auto-confirmação desabilitada**:
   - Cadastre um novo usuário
   - Deve ser redirecionado automaticamente para a home

2. **Com auto-confirmação habilitada**:
   - Cadastre um novo usuário
   - Deve receber mensagem para verificar email
   - Após confirmar o email, pode fazer login normalmente

