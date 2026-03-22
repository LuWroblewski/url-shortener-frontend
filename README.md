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

## 🐳 Subindo com Docker

```bash
# Configure o environment antes do build
cp src/environments/environment.example.ts src/environments/environment.ts
# edite com apiUrl e sentryDsn corretos

# Build e start do container
docker compose up --build
```

A aplicação ficará disponível em **http://localhost:4200**.

> O container roda o `ng serve` com `--host 0.0.0.0` para aceitar conexões externas. É um ambiente de desenvolvimento — para produção, considere um build estático servido via Nginx.

---

## 🚀 Executando o Projeto

Você pode rodar o projeto de duas formas:

**Com Docker** — configure o environment (veja a seção abaixo) e suba o container:

```bash
docker compose up --build
```

**Localmente** — instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm start
```

Acesse em **http://localhost:4200**

---

## 🏗️ Decisões Técnicas

**Fetch nativo em vez de HttpClient** — as requisições à API usam `fetch` diretamente. Para um projeto pequeno e sem necessidade de interceptors HTTP complexos, isso reduz boilerplate sem perda de funcionalidade.

**Sessão via cookie** — o token JWT é armazenado em cookie com `sameSite: Strict` e `secure: true` em vez de `localStorage`, o que oferece mais proteção contra ataques XSS.

**Proteção de rota no layout** — a validação da sessão é feita no `ngOnInit` do `MainLayout` contra o endpoint `/auth/verify`, garantindo que um token expirado ou inválido redirecione o usuário para o login sem precisar de um `AuthGuard` separado.

**Notyf para feedback** — usado como singleton (`notyf.service.ts`) para exibir toasts de sucesso e erro de forma consistente em toda a aplicação sem acoplamento a um serviço Angular.

**Paginação na listagem de URLs** — o componente `UrlTable` controla `currentPage` e `totalPages` via Signals e envia `page` e `limit` como query params para a API. A navegação entre páginas refaz o fetch automaticamente sem recarregar o componente.

---

## 🔮 Melhorias com Mais Tempo

- **HttpClient com interceptor** — migraria para `HttpClient` com um interceptor que injeta o token automaticamente em todas as requisições autenticadas, eliminando a repetição do `Authorization` header em cada chamada.
- **Refresh token silencioso** — hoje se o token expirar durante o uso, a próxima requisição falha e o usuário é jogado para o login sem aviso. Implementaria renovação automática em segundo plano.
- **Testes unitários** — os arquivos `.spec.ts` foram gerados pelo CLI mas não implementados. Cobriria os componentes principais e a lógica de autenticação.
- **Variáveis de ambiente via build** — hoje o `environment.ts` precisa ser editado manualmente antes do build. Configuraria o Angular para injetar variáveis de ambiente via `@angular/build` para facilitar deploys em pipelines de CI/CD.
- **Versionamento semântico** — o projeto já possui version no package.json, mas sem um processo formal. Adotaria o npm version integrado ao CI/CD para que cada release gere automaticamente uma tag Git, facilitando o rastreamento de deploys e a geração de changelogs com ferramentas como conventional-changelog.

---

## 🧪 Testes

```bash
# Executar testes unitários com Vitest
npm test
```

---

## 🗺️ Rotas

| Rota              | Componente    | Protegida | Descrição                    |
| ----------------- | ------------- | :-------: | ---------------------------- |
| `/`               | `LoginLayout` |    ❌     | Tela de login                |
| `/menu/dashboard` | `Dashboard`   |    ✅     | Painel principal com as URLs |
| `**`              | —             |     —     | Redireciona para `/`         |

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
