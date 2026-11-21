![image](https://github.com/user-attachments/assets/482ae99f-2fec-43a0-a061-9cb255465f01)

# 🎮 Iara Games - E-commerce de Jogos Digitais (Next.js + FSD)

Plataforma completa de e-commerce de jogos digitais desenvolvida em **Next.js** com **TypeScript** e arquitetura **Feature-Sliced Design (FSD)**, seguindo estritamente as convenções de **kebab-case** e boas práticas de engenharia de software.

---

## 🏗️ Arquitetura Feature-Sliced Design (FSD)

O projeto segue a metodologia **Feature-Sliced Design (FSD)** com todas as camadas desacopladas e nomes de arquivos/pastas padronizados em **kebab-case**:

```
src/
├── app/                        # Camada App: Configurações globais, providers e App Router do Next.js
│   ├── layout.tsx              # Root layout (HTML, Body, Fonte Montserrat, Metadata)
│   ├── providers.tsx           # Providers de contexto (AuthProvider)
│   ├── globals.css             # Estilos globais
│   ├── page.tsx                # Rota / (Início / Landing Page)
│   ├── catalog/page.tsx        # Rota /catalog (Catálogo)
│   ├── game/[game-id]/page.tsx # Rota /game/:id (Detalhes do Jogo)
│   ├── cart/page.tsx           # Rota /cart (Carrinho de compras)
│   ├── checkout/page.tsx       # Rota /checkout (Finalização de compra)
│   ├── orders/page.tsx         # Rota /orders (Histórico de pedidos)
│   ├── login/page.tsx          # Rota /login (Autenticação)
│   ├── register/page.tsx       # Rota /register (Cadastro)
│   ├── payment/
│   │   ├── pix/page.tsx        # Rota /payment/pix (Pagamento via PIX)
│   │   └── boleto/page.tsx     # Rota /payment/boleto (Pagamento via Boleto)
│   ├── success/page.tsx        # Rota /success (Confirmação de pedido)
│   └── cancel/page.tsx         # Rota /cancel (Cancelamento de pagamento)
│
├── views/                      # Camada Views (Composições completas de páginas)
│   ├── home/                   # home-page.tsx
│   ├── catalog/                # catalog-page.tsx
│   ├── game-details/           # game-details-page.tsx
│   ├── cart/                   # cart-page.tsx
│   ├── checkout/               # checkout-page.tsx
│   ├── orders/                 # orders-page.tsx
│   ├── login/                  # login-page.tsx
│   ├── register/               # register-page.tsx
│   ├── pix-payment/            # pix-payment-page.tsx
│   ├── boleto-payment/         # boleto-payment-page.tsx
│   ├── success/                # success-page.tsx
│   └── cancel/                 # cancel-page.tsx
│
├── widgets/                    # Camada Widgets: Blocos visuais autônomos
│   ├── header/                 # Header com logo, navegação, carrinho e menu mobile
│   ├── footer/                 # Rodapé institucional com links e copyright
│   ├── landing-hero/           # Hero interativo com cards 3D e sons dos personagens
│   ├── landing-featured/       # Destaques promocionais e indies brasileiros
│   ├── game-catalog/           # Catálogo completo com busca, filtros, grid e paginação
│   ├── game-details-view/      # Tela de detalhes, metadados, galeria e compra
│   ├── cart-view/              # Gerenciamento de itens do carrinho e resumo
│   ├── checkout-view/          # Formulário de entrega (ViaCEP) e seleção de pagamento
│   └── order-history/          # Estatísticas e listagem de pedidos concluídos
│
├── features/                   # Camada Features: Interações de negócio do usuário
│   ├── add-to-cart/            # Botão de alternar jogo no carrinho com sons e toasts
│   ├── search-games/           # Input de busca com debounce configurável
│   ├── filter-games/           # Seleção de ordenação de catálogo
│   ├── auth/                   # Formulários de Login e Cadastro (Formik + Yup)
│   ├── lookup-cep/             # Consulta de endereço automático via ViaCEP
│   ├── copy-to-clipboard/      # Botão de copiar com feedback (PIX e Boleto)
│   └── route-guard/            # Guarda de rotas protegidas (Auth Guard)
│
├── entities/                   # Camada Entities: Modelos de domínio do negócio
│   ├── game/                   # Modelos, hooks (useGames, useGameDetails) e GameCard
│   ├── cart/                   # useCart (localStorage e eventos de sincronização), sons
│   ├── user/                   # AuthContext, login, register, logout
│   ├── order/                  # Armazenamento e persistência de pedidos, OrderCard
│   └── payment/                # Geradores de PIX (QR Code) e Boleto (código de barras)
│
└── shared/                     # Camada Shared: Código agnóstico reutilizável
    ├── api/                    # Cliente HTTP (Axios) com interceptors
    ├── config/                 # Variáveis de ambiente e constantes de rotas
    ├── lib/                    # Formatadores (moeda, data, CPF, CEP, cartão) e áudio
    ├── styles/                 # Design tokens (tokens.css) e resets (globals.css)
    └── ui/                     # Componentes base (Button, Input, Container, Spinner)
```

---

## 🚀 Tecnologias

- **Next.js 14 (App Router)** - Framework React para produção
- **React 18 + TypeScript** - UI declarativa e tipagem estática rigorosa
- **CSS Modules** - Estilização escopada com Design Tokens
- **Phosphor Icons** - Biblioteca moderna de ícones vetoriais
- **Axios** - Cliente HTTP com interceptors de autenticação
- **Formik + Yup** - Gerenciamento e validação de formulários
- **qrcode** - Geração dinâmica de QR Code para pagamento PIX
- **react-barcode** - Geração de código de barras para boletos bancários

---

## 📦 Como Executar

### Pré-requisitos
- Node.js 18+ (recomendado Node 18.20+)
- npm

### 1. Clonar e Instalar
```bash
git clone https://github.com/seu-usuario/iara-games.git
cd "Iara Games"
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

### 3. Rodar em Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Build de Produção
```bash
npm run build
npm run start
```

---

## 🎮 Funcionalidades Principais

1. **Landing Page Integrada (`/`)**:
   - Hero com vídeo de fundo e tipografia da marca.
   - Cards 3D interativos com sons clássicos do Mario, Sonic e Luigi ao clicar.
   - Vitrine de jogos indies brasileiros em destaque.

2. **Catálogo de Jogos (`/catalog`)**:
   - Integração com a RAWG API (milhares de jogos).
   - Busca em tempo real com debounce de 500ms.
   - Ordenação por avaliação, data de lançamento, popularidade e nome.
   - Paginação completa.
   - Adicionar e remover do carrinho com efeito sonoro e feedback visual.

3. **Detalhes do Jogo (`/game/:id`)**:
   - Metadados completos: avaliação, data, Metacritic, tempo de jogo, plataformas e sinopse.
   - Galeria de capturas de tela (screenshots).
   - Caixa de compra com adição direta ao carrinho.

4. **Carrinho de Compras (`/cart`)**:
   - Itens de jogos digitais salvos localmente no `localStorage`.
   - Cálculo automático de subtotal e total.
   - Sincronização em tempo real entre abas e componentes.

5. **Checkout e Pagamento (`/checkout`)**:
   - Rota protegida por autenticação (`RouteGuard`).
   - Busca automática de endereço pelo CEP via ViaCEP.
   - 3 opções de pagamento:
     - **Cartão de Crédito** (com simulação de aprovação instantânea).
     - **PIX** (com QR Code gerado dinamicamente e payload Copia e Cola).
     - **Boleto Bancário** (com código de barras CODE128 e linha digitável formatada).

6. **Histórico de Pedidos (`/orders`)**:
   - Estatísticas de gastos, quantidade de pedidos e jogos adquiridos.
   - Cartões detalhados para cada pedido realizado.

7. **Autenticação (`/login` e `/register`)**:
   - Autenticação com persistência de token e redirecionamento dinâmico pós-login.
