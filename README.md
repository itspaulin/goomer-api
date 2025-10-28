# 🍽️ Goomer Menu API

API para gerenciamento de produtos, promoções e cardápios de restaurantes, desenvolvida como parte do desafio técnico da Goomer.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Desafios e Soluções](#desafios-e-soluções)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Docker](#docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Padrões e Boas Práticas](#padrões-e-boas-práticas)

---

## 🎯 Sobre o Projeto

A Goomer Menu API é uma aplicação backend robusta que permite restaurantes gerenciarem seus produtos, promoções e cardápios de forma eficiente. O projeto foi desenvolvido seguindo princípios de Clean Architecture e Domain-Driven Design (DDD), garantindo alta manutenibilidade e escalabilidade.

### Funcionalidades Principais

- ✅ **CRUD Completo de Produtos**
  - Criação, listagem, atualização e exclusão
  - Controle de visibilidade (produtos podem ser ocultados sem exclusão)
  - Ordenação customizável no cardápio
- ✅ **CRUD Completo de Promoções**
  - Vinculação de promoções a produtos específicos
  - Definição de dias da semana e horários ativos
  - Validação de preço promocional (deve ser menor que o preço original)
- ✅ **Cardápio Consolidado**
  - Retorna apenas produtos visíveis
  - Aplica promoções ativas baseadas em dia/horário
  - Organizado por categorias
  - Suporte a múltiplos timezones

### Funcionalidades Opcionais Implementadas

- ✅ **Ordenação de Produtos**: Controle total sobre a ordem de exibição no cardápio
- ✅ **Tratamento de Timezone**: Suporte para restaurantes em diferentes fusos horários

---

## 🚀 Tecnologias

### Core

- **[Bun](https://bun.sh/)** - Runtime JavaScript/TypeScript de alta performance
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Express](https://expressjs.com/)** - Framework web minimalista

### Banco de Dados

- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first com suporte a SQL puro
- **SQL Raw** - Queries implementadas em SQL puro (requisito do desafio)

### Validação e Documentação

- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação interativa da API
- **[Luxon](https://moment.github.io/luxon/)** - Manipulação de datas e timezones

### Testes

- **[Vitest](https://vitest.dev/)** - Framework de testes unitários e de integração
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes de requisições HTTP

### DevOps

- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas:

```
src/
├── core/                    # Entidades base e utilitários
│   ├── entities/           # Classes base para entidades
│   ├── errors/             # Erros customizados
│   └── types/              # Either (Result pattern)
│
├── domain/                  # Camada de domínio (regras de negócio)
│   ├── application/
│   │   ├── repositories/   # Interfaces dos repositórios
│   │   └── use-cases/      # Casos de uso da aplicação
│   └── enterprise/
│       └── entities/       # Entidades de domínio
│
└── infra/                   # Camada de infraestrutura
    ├── config/             # Configurações (env, swagger)
    ├── database/           # Conexão e schemas do banco
    ├── drizzle/            # Migrations e schemas Drizzle
    ├── factories/          # Factories para injeção de dependência
    ├── http/               # Camada HTTP
    │   ├── controllers/    # Controllers
    │   ├── presenters/     # Formatação de respostas
    │   ├── routes/         # Definição de rotas
    │   └── schemas/        # Validação de requisições (Zod)
    ├── providers/          # Providers externos
    └── repositories/       # Implementações dos repositórios
```

### Decisões Técnicas

#### Por que Bun?

- **Performance**: Bun é significativamente mais rápido que Node.js
- **Versatilidade**: Runtime, bundler, test runner e package manager em uma única ferramenta
- **Developer Experience**: Melhor DX com execução direta de TypeScript

#### Por que Express?

- **Simplicidade**: Framework minimalista que não impõe arquitetura
- **Flexibilidade**: Total controle sobre a estrutura do projeto
- **Familiaridade**: Mais experiência com o framework

#### Por que PostgreSQL?

- **Robustez**: Banco de dados relacional maduro e confiável
- **Features**: Suporte nativo a ENUM, JSON, arrays, etc.
- **Familiaridade**: Maior experiência com PostgreSQL

#### Por que Drizzle ORM?

- **SQL Puro**: Permite escrever queries em SQL raw (requisito do desafio)
- **Type Safety**: Tipagem forte e inferência de tipos
- **Migrations**: Sistema de migrations integrado
- **Performance**: Overhead mínimo comparado a outros ORMs

---

## 📦 Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/goomer-api.git
cd goomer-api
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://goomer:goomer@localhost:5432/goomer

# Server
PORT=3333
NODE_ENV=development

# Documentation
ENABLE_DOCS=true
```

### 4. Inicie o banco de dados com Docker

```bash
docker-compose up -d
```

Isso irá subir:

- PostgreSQL na porta `5432`
- Adminer (interface web) na porta `8080`

### 5. Execute as migrations

```bash
bun run migrate
```

### 6. Inicie o servidor

```bash
bun dev
```

O servidor estará rodando em `http://localhost:3333`

### 7. Acesse a documentação

Abra o navegador em:

```
http://localhost:3333/api-docs
```

---

## 📚 Documentação da API

A API possui documentação interativa completa com Swagger/OpenAPI.

### Endpoints Principais

#### Produtos

- `GET /products` - Lista todos os produtos
- `GET /products/:id` - Busca produto por ID
- `POST /products` - Cria novo produto
- `PUT /products/:id` - Atualiza produto
- `DELETE /products/:id` - Remove produto

#### Promoções

- `GET /promotions` - Lista todas as promoções
- `POST /promotions` - Cria nova promoção
- `PUT /promotions/:id` - Atualiza promoção
- `DELETE /promotions/:id` - Remove promoção

#### Cardápio

- `GET /menu?timezone=America/Sao_Paulo` - Retorna cardápio consolidado

### Exemplos de Requisições

#### Criar Produto

```bash
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita",
    "price": 29.90,
    "category": "Pratos principais",
    "visible": true,
    "order": 1
  }'
```

#### Criar Promoção

```bash
curl -X POST http://localhost:3333/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "description": "Happy Hour",
    "promotional_price": 19.90,
    "days": ["friday", "saturday"],
    "start_time": "18:00",
    "end_time": "22:00"
  }'
```

#### Buscar Cardápio

```bash
curl "http://localhost:3333/menu?timezone=America/Sao_Paulo"
```

### Formato de Horários

Os horários seguem o formato `HH:mm` com intervalos de **15 minutos**:

- ✅ Válidos: `18:00`, `18:15`, `18:30`, `18:45`
- ❌ Inválidos: `18:10`, `18:20`, `18:05`

### Categorias de Produtos

- `Entradas`
- `Pratos principais`
- `Sobremesas`
- `Bebidas`

---

## 🧪 Testes

O projeto possui cobertura de testes unitários e de integração (E2E).

### Executar apenas testes unitários

```bash
bun run test
```

### Executar apenas testes E2E

```bash
bun run test:e2e
```

### Estrutura de Testes

```
test/
├── unit/                   # Testes unitários
│   ├── use-cases/         # Testes de casos de uso
│   └── entities/          # Testes de entidades
└── e2e/                    # Testes de integração
    ├── products.test.ts   # Testes de produtos
    ├── promotions.test.ts # Testes de promoções
    └── menu.test.ts       # Testes de cardápio
```

---

## 🎯 Desafios e Soluções

### 1. Validação de Horários com Intervalos de 15 minutos

**Desafio**: Garantir que os horários inseridos respeitem intervalos de 15 minutos.

**Solução**: Implementação de regex no schema Zod:

```typescript
z.string().regex(
  /^([0-1][0-9]|2[0-3]):(00|15|30|45)$/,
  "Time must be in HH:mm format with 15-minute intervals"
);
```

### 2. Tratamento de Timezone

**Desafio**: Aplicar promoções corretamente considerando diferentes fusos horários.

**Solução**:

- Uso da biblioteca Luxon para manipulação de datas/horários
- Conversão do horário do servidor para o timezone do restaurante
- Comparação de dia da semana e horário no timezone local

```typescript
const now = DateTime.now().setZone(timezone);
const currentDay = now.toFormat("cccc").toLowerCase();
const currentTime = now.toFormat("HH:mm");
```

### 3. SQL Raw com Type Safety

**Desafio**: Usar SQL puro mantendo type safety do TypeScript.

**Solução**:

- Uso do Drizzle ORM que suporta SQL raw
- Criação de mappers para converter entre domínio e banco de dados
- Type casting quando necessário: `(result as any[]).map(...)`

### 4. Configuração do Docker vs Servidor Local

**Desafio**: Durante desenvolvimento, às vezes o Docker ocupava a porta causando conflitos.

**Solução**:

- Implementação de tratamento de erro `EADDRINUSE`
- Mensagens claras sobre portas ocupadas
- Script para verificar processos: `netstat -ano | findstr :3333`

### 5. Estrutura de Promoções Complexa

**Desafio**: Promoções ativas apenas em dias/horários específicos.

**Solução**:

- Armazenamento de dias como array de strings no banco
- Lógica de validação no use case `GetMenuUseCase`
- Comparação de dia e horário considerando timezone

---

## 📁 Estrutura do Projeto

```
goomer-api/
├── drizzle/                 # Migrations do Drizzle
├── scripts/                 # Scripts utilitários
├── src/
│   ├── core/               # Entidades base
│   ├── domain/             # Regras de negócio
│   └── infra/              # Implementações
├── test/                    # Testes
├── .env.example            # Exemplo de variáveis de ambiente
├── docker-compose.yml      # Configuração Docker
├── Dockerfile              # Imagem Docker da aplicação
├── drizzle.config.ts       # Configuração Drizzle ORM
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
├── vite.config.ts          # Configuração Vitest (unit)
├── vite.config.e2e.ts      # Configuração Vitest (e2e)
└── README.md               # Este arquivo
```

---

## 🐳 Docker

### Serviços Disponíveis

O `docker-compose.yml` configura:

1. **PostgreSQL** (porta 5432)

   - User: `goomer`
   - Password: `goomer`
   - Database: `goomer`

2. **Adminer** (porta 8080)
   - Interface web para gerenciar o banco
   - Acesse: `http://localhost:8080`

### Comandos Úteis

```bash
# Subir serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild da aplicação
docker-compose up --build
```

---

## 🔐 Variáveis de Ambiente

| Variável       | Descrição                      | Padrão        | Obrigatório |
| -------------- | ------------------------------ | ------------- | ----------- |
| `DATABASE_URL` | URL de conexão PostgreSQL      | -             | ✅          |
| `PORT`         | Porta do servidor              | `3333`        | ❌          |
| `NODE_ENV`     | Ambiente de execução           | `development` | ❌          |
| `ENABLE_DOCS`  | Habilitar documentação Swagger | `true`        | ❌          |

---

## 📊 Padrões e Boas Práticas

### Commits

- Commits pequenos e descritivos
- Conventional Commits (feat, fix, docs, etc.)
- Mensagens em português

### Code Style

- ESLint e Prettier configurados
- Nomenclatura clara e descritiva
- Separação de responsabilidades

### Segurança

- Validação de entrada com Zod
- Prepared statements (proteção contra SQL injection)
- Variáveis de ambiente para dados sensíveis

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

## 👤 Autor

Desenvolvido por **Paulo Barbosa** como parte do desafio técnico da Goomer.

---

⭐ Desenvolvido com Bun, TypeScript e ❤️
