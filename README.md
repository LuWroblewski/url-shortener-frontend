# 🔗 URL Shortener — Frontend

Interface web para o encurtador de URLs, construída com Angular 21, TailwindCSS e DaisyUI.

---

## 🚀 Tecnologias

- **[Angular 21](https://angular.dev/)** — Framework principal (Standalone Components, Signals)
- **[TailwindCSS v4](https://tailwindcss.com/)** — Estilização utilitária
- **[DaisyUI v5](https://daisyui.com/)** — Componentes UI sobre Tailwind
- **[Lucide Angular](https://lucide.dev/)** — Ícones
- **[Notyf](https://github.com/caroso1222/notyf)** — Notificações toast
- **[ngx-cookie-service](https://github.com/stevermeister/ngx-cookie-service)** — Gerenciamento de cookies (sessão JWT)
- **[@sentry/angular](https://docs.sentry.io/platforms/javascript/guides/angular/)** — Monitoramento de erros
- **[Vitest](https://vitest.dev/)** — Testes unitários
- **[Biome](https://biomejs.dev/)** — Linter e formatter

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── components/
│   │   │   ├── header/            # Navbar com logout
│   │   │   ├── footer/            # Rodapé
│   │   │   ├── url-table/         # Tabela de URLs (listar, copiar, excluir, reativar)
│   │   │   └── url-create-modal/  # Modal para criar nova URL
│   │   └── layouts/
│   │       ├── login-layout/      # Página de login
│   │       └── main-layout/       # Layout autenticado (valida sessão no init)
│   ├── features/
│   │   └── dashboard/             # Página principal após login
│   ├── shared/
│   │   └── notfy/                 # Serviço Notyf (toasts)
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
├── environments/
│   ├── environment.example.ts     # Template para configuração
│   ├── environment.ts             # Produção
│   └── environment.development.ts # Desenvolvimento
└── main.ts                        # Bootstrap + init do Sentry
```

---

## ⚙️ Configuração do Environment

Antes de rodar o projeto, configure o arquivo de environment. Copie o arquivo de exemplo:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Preencha as variáveis:

```typescript
export const environment = {
  production: false,

  // URL base da API backend (com barra no final)
  apiUrl: 'http://localhost:3000/',

  // DSN do seu projeto no Sentry (deixe vazio para desativar)
  sentryDsn: 'https://SEU_DSN@oXXXXX.ingest.sentry.io/XXXXX',
};
```

> **Atenção:** o `apiUrl` deve terminar com `/` e apontar para o mesmo endereço configurado no backend. Em desenvolvimento padrão, use `http://localhost:3000/`.

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 20+
- npm 11+

### Desenvolvimento

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
# ou
ng serve
```

Acesse em **http://localhost:4200**

### Build de Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

### Build em modo watch

```bash
npm run watch
```

---

## 🧪 Testes

```bash
# Executar testes unitários com Vitest
npm test
```

---

## 🗺️ Rotas

| Rota              | Componente      | Protegida | Descrição                       |
|-------------------|-----------------|:---------:|---------------------------------|
| `/`               | `LoginLayout`   | ❌        | Tela de login                   |
| `/menu/dashboard` | `Dashboard`     | ✅        | Painel principal com as URLs    |
| `**`              | —               | —         | Redireciona para `/`            |

A proteção de rota é feita no `ngOnInit` do `MainLayout`, que verifica o cookie `session` e valida o token contra o endpoint `/auth/verify`. Caso inválido, redireciona para o login.

---

## 🔐 Autenticação

A sessão é armazenada em um cookie chamado `session` com as seguintes configurações:

- Expiração: **12 horas** (0.5 dia)
- `sameSite: Strict`
- `secure: true`

O token JWT é enviado como `Authorization: Bearer <token>` em todas as requisições autenticadas.

---

## 🧩 Componentes Principais

### `UrlTable`
Exibe a lista de URLs do usuário autenticado com suporte a:
- Copiar o link encurtado para a área de transferência
- Excluir URL (soft delete)
- Reativar URL desativada
- Indicador de status (ativa / inativa)

### `CreateUrlModal`
Modal com formulário para cadastrar uma nova URL. Valida se a URL começa com `http://` ou `https://` antes de enviar.

### `Header`
Navbar com link para o dashboard e botão de logout (limpa o cookie e redireciona para `/`).

---

## 📊 Monitoramento (Sentry)

O Sentry é inicializado em `main.ts` antes do bootstrap da aplicação e integrado ao `ErrorHandler` global do Angular via `Sentry.createErrorHandler()`.

Para ativar, preencha `sentryDsn` no arquivo de environment com o DSN do seu projeto em [sentry.io](https://sentry.io).

---

## 🔗 Integração com o Backend

Este frontend consome a API do [url-shortener-backend](../url-shortener-backend). Certifique-se de que o backend está rodando e que o `apiUrl` no environment aponta para o endereço correto.

O backend precisa estar configurado com CORS permitindo a origem `http://localhost:4200` (já configurado por padrão no backend).