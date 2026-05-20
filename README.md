# Freeplaning

Frontend do **Freeplaning** — aplicação web para gestão de projetos freelance: pipeline visual, clientes, métricas financeiras e configurações de perfil.

## Funcionalidades

- **Autenticação** — login e cadastro com JWT
- **Dashboard** — resumo de projetos ativos, faturamento do mês, entregas da semana e pipeline Kanban (negociação, em andamento, pausados) com drag-and-drop
- **Projetos** — listagem e detalhes com status, plataforma, tipo, valores e prazos
- **Clientes** — cadastro e visualização de clientes vinculados aos projetos
- **Configurações** — perfil do usuário, ocupação, valor/hora, e-mail e senha
- **Tema** — modo claro/escuro (preferência do sistema ou escolha manual, persistida no `localStorage`)

## Stack

| Tecnologia | Uso |
|------------|-----|
| [Angular](https://angular.dev/) 21 | Framework SPA |
| [PrimeNG](https://primeng.org/) | Componentes de UI |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização utilitária |
| [Angular CDK](https://material.angular.io/cdk) | Drag-and-drop no pipeline |
| [RxJS](https://rxjs.dev/) | Programação reativa |
| [Vitest](https://vitest.dev/) | Testes unitários |

## Pré-requisitos

- **Node.js** `^20.19.0`, `^22.12.0` ou `>=24.0.0` (exigido pelo Angular CLI 21)
- **npm** 11+ (o projeto declara `packageManager: npm@11.6.2`)
- API backend do Freeplaning em execução (desenvolvimento local ou instância hospedada)

## Instalação

```bash
git clone <url-do-repositorio>
cd freeplaning
npm install
```

## Configuração da API

A URL da API é definida em `src/environments/`:

| Arquivo | Ambiente | `apiUrl` padrão |
|---------|----------|-----------------|
| `environment.ts` | Produção | `https://free-planning.onrender.com` |
| `environment.development.ts` | Desenvolvimento | `http://localhost:8080` |

O build de desenvolvimento (`ng serve`) usa automaticamente `environment.development.ts` via `fileReplacements` no `angular.json`.

Para apontar para outra API, edite o `apiUrl` no arquivo correspondente.

## Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm start
# ou: ng serve
```

A aplicação fica disponível em [http://localhost:4200](http://localhost:4200) e recarrega ao alterar os arquivos fonte.

### Rotas principais

| Rota | Descrição |
|------|-----------|
| `/auth/login` | Login |
| `/auth/register` | Cadastro |
| `/dashboard` | Dashboard (requer autenticação) |
| `/projects` | Lista de projetos |
| `/projects/:id` | Detalhe do projeto |
| `/clients` | Lista de clientes |
| `/settings` | Configurações do usuário |

## Build

Build de produção (otimizado, artefatos em `dist/freeplaning/`):

```bash
npm run build
# ou: ng build
```

Build de desenvolvimento com watch:

```bash
npm run watch
```

## Testes

Testes unitários com Vitest:

```bash
npm test
# ou: ng test
```

## Estrutura do projeto

```
src/
├── app/
│   ├── core/           # Guards, interceptors, modelos, serviços compartilhados, layout
│   └── features/       # Módulos por domínio (auth, dashboard, projects, clients, settings)
├── environments/       # Configuração da API por ambiente
├── index.html
├── main.ts
└── styles.css
```

## Scripts npm

| Script | Comando equivalente | Descrição |
|--------|---------------------|-----------|
| `start` | `ng serve` | Servidor de desenvolvimento |
| `build` | `ng build` | Build de produção |
| `watch` | `ng build --watch --configuration development` | Build contínuo em modo dev |
| `test` | `ng test` | Testes unitários |

## Scaffolding (Angular CLI)

Para gerar componentes, diretivas ou pipes:

```bash
ng generate component nome-do-componente
ng generate --help
```

## Recursos

- [Documentação Angular](https://angular.dev/)
- [Angular CLI — referência de comandos](https://angular.dev/tools/cli)
