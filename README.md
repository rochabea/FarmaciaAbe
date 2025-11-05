# 🏥 Farmácia Abe

Aplicativo mobile desenvolvido com **React Native (Expo)** integrado ao **Supabase**, com o objetivo de oferecer um **marketplace de farmácias**, permitindo que o usuário encontre e compre produtos de diferentes farmácias em um só lugar.


## 🚀 Tecnologias Utilizadas

- **React Native (Expo)**
- **TypeScript / JavaScript**
- **Supabase** 
- **AsyncStorage** 
- **Expo Router**
- **React Navigation**
- **Figma**


## 💡 Funcionalidades Principais

- 🧾 **Cadastro e Login** de usuários via Supabase  
- 🏪 **Listagem de farmácias** disponíveis  
- 💊 **Catálogo de produtos** de múltiplas farmácias  
- 🛒 **Carrinho de compras** integrado  
- 🔍 **Busca por produtos e farmácias**  
- 👤 **Perfil do usuário** com histórico de pedidos  
- ⚙️ **Integração com Supabase** para sincronização de dados em tempo real  


## 🔧 Como iniciar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/rochabea/FarmaciaAbe.git
```

2. Após clonar o repositório, entre na pasta do projeto:
```bash
cd abe
npm install
```

3. Entre na pasta abe e inicie o Expo (no Git Bash):
```bash
cd abe
npx expo start
```

Após isso basta escanear o QR Code com o app Expo Go no celular para rodar o aplicativo, ou apertar "W" para abrir no browser.

## 🧠 Arquitetura 

O app segue uma arquitetura modular com contextos e hooks personalizados, integrando o Supabase para autenticação e dados de usuários e produtos.

| Camada | Descrição |
|--------|-----------|
| UI | Interface construída com React Native e NativeWind |
| Dados | Banco e autenticação via Supabase |
| Armazenamento Local | AsyncStorage |
| Navegação | Expo Router e React Navigation |
