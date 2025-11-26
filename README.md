# 🏥 Farmácia Abê --- Marketplace de Farmácias

Aplicativo mobile desenvolvido com **React Native (Expo)** e
**Supabase**, criado para oferecer uma experiência completa de compra de
medicamentos e produtos de farmácia.

O usuário pode navegar por produtos, adicionar itens ao carrinho,
favoritar, enviar receitas, solicitar manipulados e acompanhar o status
do pedido --- tudo em um único app moderno, rápido e responsivo.

------------------------------------------------------------------------

# 📱 Publicação do Aplicativo (EAS Update)

A versão mais recente do app está publicada na nuvem da Expo via EAS Update, permitindo que qualquer pessoa teste o aplicativo diretamente no celular.

## Link da publicação

🔗 Projeto no Expo: https://expo.dev/accounts/rochabea/projects/FarmaciaAbe  
🔗 Versão publicada (EAS Update): https://expo.dev/accounts/rochabea/projects/FarmaciaAbe/updates/66cd0818-3db3-46a6-b5c6-bb959124c9bf


## Como testar o app
1. Instale o Expo Go no celular
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/br/app/expo-go/id982107779
2. Abra o link da publicação
3. O Expo Go carregará automaticamente a versão atual do app

- Sempre que uma nova atualização for enviada via eas update, o app será atualizado automaticamente

# Comandos utilizados

``` bash
eas init
eas update --branch main --message "Publicação inicial"
```

## 🚀 Tecnologias Utilizadas

### **Frontend**

-   ⚛️ React Native (Expo)
-   💙 TypeScript
-   🧭 Expo Router (navegação com rotas estruturadas)
-   🎨 Styled Components / estilos customizados
-   📱 Safe Area Context

### **Backend**

-   🟣 Supabase (Auth, Database, Storage)
-   🔐 RLS (Row Level Security)
-   🗂️ VIEWS customizadas

### **Armazenamento**

-   📦 AsyncStorage

### **Outras Ferramentas**

-   🧪 Expo Document Picker
-   🎨 Figma
-   ⚡ APIs internas (lib/)

------------------------------------------------------------------------

## 💡 Funcionalidades do Aplicativo

### 🧍‍♂️ 1. Perfis de Acesso

-   Cliente (fluxo completo)
-   Entregador (protótipo)
-   Farmacêutico (em desenvolvimento)

### 🔐 2. Autenticação

-   Cadastro
-   Login
-   Logout
-   Sessão persistida

### 🛒 3. Carrinho de Compras

-   Adicionar itens\
-   Remover itens\
-   Atualizar quantidades\
-   Total automático\
-   Aviso de **produto que exige receita**

### ❤️ 4. Favoritos

-   Adicionar/remover
-   Listagem sincronizada
-   Ordenação por data

### 💊 5. Catálogo de Produtos

-   Lista completa
-   Produtos promocionais
-   Busca
-   Página de detalhes

### 📬 6. Manipulados

-   Upload de PDF
-   Nome da medicação
-   Envio ao Supabase Storage
-   Status do pedido
-   Aprovado / Rejeitado / Pronto
-   Tela final de confirmação

### 🧪 7. Módulo do Entregador

-   Protótipo funcional

### 🔔 8. Notificações internas

### 👤 9. Conta e Perfil

-   Dados do usuário
-   Histórico
-   Logout

------------------------------------------------------------------------

## 🧠 Arquitetura do Projeto

  Camada      Responsabilidade
  ----------- ------------------------------------
  UI          Telas em React Native
  Contextos   Auth, Cart, Favorites, Manipulados
  Lib         Comunicação com Supabase
  Banco       Tabelas + Views + RLS
  Navegação   Expo Router

------------------------------------------------------------------------

## 🔧 Como Executar o Projeto

### 1. Clone o repositório

``` bash
git clone https://github.com/rochabea/FarmaciaAbe.git
```

### 2. Instale dependências

``` bash
cd abe
npm install
```

### 3. Inicie o Expo

``` bash
npx expo start
```

### 4. Execute

-   Expo Go\
-   Browser (pressione W)

------------------------------------------------------------------------

## ⚠️ Perfis Disponíveis

-   Cliente → completo\
-   Entregador → protótipo\
-   Farmacêutico → em desenvolvimento

------------------------------------------------------------------------

## 📂 Estrutura do Projeto

    abe/
     ├── app/
     │    ├── (tabs)/
     │    ├── manipulados/
     │    ├── conta/
     │    ├── favoritos/
     │    ├── notificacao/
     │    └── ...
     ├── lib/
     ├── context/
     └── assets/

------------------------------------------------------------------------

## 🎯 Roadmap

-   Pagamentos online\
-   Rastreio\
-   Chat\
-   Dashboard para farmácias\
-   Modo escuro

------------------------------------------------------------------------

## ❤️ Autoras

**Beatriz Araujo (rochabea)** e **Ana Alice Alves (alicettins)**
