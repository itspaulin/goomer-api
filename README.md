# Goomer Menu API

[![CI](https://github.com/itspaulin/goomer-api/actions/workflows/checks-backend.yml/badge.svg)](https://github.com/itspaulin/goomer-api/actions/workflows/checks-backend.yml)

API para gerenciamento de produtos, promoções e cardápios de restaurantes, desenvolvida como parte do desafio técnico da Goomer.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Desafios e Soluções](#desafios-e-soluções)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Docker](#docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Padrões e Boas Práticas](#padrões-e-boas-práticas)

---

## Sobre o Projeto

A Goomer Menu API é uma aplicação backend robusta que permite restaurantes gerenciarem seus produtos, promoções e cardápios de forma eficiente. O projeto foi desenvolvido seguindo princípios de Clean Architecture e Domain-Driven Design (DDD), garantindo alta manutenibilidade e escalabilidade.

### Funcionalidades Principais

- [x] CRUD Completo de Produtos
  - [x] Criação, listagem, atualização e exclusão
  - [x] Controle de visibilidade (produtos podem ser ocultados sem exclusão)
  - [x] Ordenação customizável no cardápio
- [x] CRUD Completo de Promoções
  - [x] Vinculação de promoções a produtos específicos
  - [x] Definição de dias da semana e horários ativos
  - [x] Validação de preço promocional (deve ser menor que o preço original)
- [x] Cardápio Consolidado
  - [x] Retorna apenas produtos visíveis
  - [x] Aplica promoções ativas baseadas em dia/horário
  - [x] Organizado por categorias
  - [x] Suporte a múltiplos timezones

### Opcionais

- [x] Ordenação de Produtos: Controle total sobre a ordem de exibição no cardápio
- [x] Tratamento de Timezone: Suporte para restaurantes em diferentes fusos horários

### Melhorias Futuras

- Sistema de cupons de desconto
- Integração com S3 para upload de imagens de produtos
- Melhor gerenciamento de promoções (promoções em cascata, promoções combinadas, promoções por categoria)
- Autenticação e autorização
- Sistema de notificações para promoções ativas

---

## Tecnologias

### Core

- **[Bun](https://bun.sh/)** - Package manager de alta performance
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Express](https://expressjs.com/)** - Framework web minimalista

### Banco de Dados

- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first com suporte a SQL puro
- **SQL Raw** - Queries implementadas em SQL puro

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
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automatizado

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas:

```
src/
├── core/
│   ├── entities/
│   ├── errors/
│   └── types/
│
├── domain/
│   ├── application/
│   │   ├── repositories/
│   │   └── use-cases/
│   └── enterprise/
│       └── entities/
│
└── infra/
    ├── config/
    ├── database/
    ├── drizzle/
    ├── factories/
    ├── http/
    │   ├── controllers/
    │   ├── presenters/
    │   ├── routes/
    │   └── schemas/
    ├── providers/
    └── repositories/
```

### Decisões Técnicas

#### Por que Bun?

- **Performance**: Bun é significativamente mais rápido que npm/yarn
- **Versatilidade**: Package manager completo e eficiente
- **Developer Experience**: Melhor DX com instalação e execução mais rápidas

#### Por que Express?

- **Simplicidade**: Framework minimalista que não impõe arquitetura
- **Flexibilidade**: Total controle sobre a estrutura do projeto
- **Familiaridade**: Mais experiência com o framework

#### Por que PostgreSQL?

- **Robustez**: Banco de dados relacional maduro e confiável
- **Features**: Suporte nativo a ENUM, JSON, arrays, etc.
- **Familiaridade**: Maior experiência com PostgreSQL

#### Por que Drizzle ORM?

- **SQL Puro**: Permite escrever queries em SQL raw
- **Type Safety**: Tipagem forte e inferência de tipos
- **Migrations**: Sistema de migrations integrado
- **Performance**: Overhead mínimo comparado a outros ORMs

---

## Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/itspaulin/goomer-api.git
cd goomer-api
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://goomer:goomer@localhost:5432/goomer
PORT=3333
NODE_ENV=development
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

## Documentação da API

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

- Válidos: `18:00`, `18:15`, `18:30`, `18:45`
- Inválidos: `18:10`, `18:20`, `18:05`

### Categorias de Produtos

- `Entradas`
- `Pratos principais`
- `Sobremesas`
- `Bebidas`

---

## Testes

O projeto possui cobertura de testes unitários e de integração (E2E).

### Executar todos os testes

```bash
bun test:all
```

### Executar testes unitários

```bash
bun test:unit
```

### Executar testes E2E

```bash
bun test:e2e
```

### Executar com coverage

```bash
bun test:coverage
```

### Estrutura de Testes

```
test/
├── unit/
│   ├── use-cases/
│   └── entities/
└── e2e/
    ├── products.test.ts
    ├── promotions.test.ts
    └── menu.test.ts
```

---

## CI/CD

O projeto utiliza **GitHub Actions** para automação de testes e validações em cada Pull Request.

### Pipeline de CI

O workflow `.github/workflows/checks-backend.yml` é executado automaticamente quando:

- Um Pull Request é aberto ou atualizado
- Há alterações em arquivos dentro de `src/`
- Há alterações em `package.json`, `bun.lock`, `docker-compose.yml` ou `Dockerfile`
- O workflow é executado manualmente via `workflow_dispatch`

### Arquitetura do Workflow

O pipeline é dividido em **3 jobs principais** que rodam em paralelo (com dependências):

```
Setup (job base)
├── Build Check (depende de Setup)
└── Tests (depende de Setup)
```

#### 1. **Setup Job**

Prepara o ambiente e instala dependências:

- Checkout do código
- Instalação do Bun 1.3.1
- Cache de dependências do Bun
- Instalação de dependências com `--frozen-lockfile`

**Por que usar cache?**
O cache reduz significativamente o tempo de execução do workflow, evitando reinstalar todas as dependências a cada execução.

#### 2. **Build Check Job**

Valida a integridade do código:

- Type checking com TypeScript
- Garante que não há erros de tipagem
- Falha se houver erros de compilação

**Objetivo**: Capturar erros de tipo antes de rodar os testes, economizando tempo.

#### 3. **Tests Job**

Executa toda a suite de testes em um ambiente isolado:

**Configuração do ambiente:**

```yaml
env:
  DATABASE_URL: postgresql://goomer:goomer@localhost:5432/goomer
  NODE_ENV: test
  PORT: 3333
```

**Etapas:**

1. **Inicia PostgreSQL com Docker Compose**

```bash
   docker compose up -d db
```

2. **Aguarda o banco estar pronto**

```bash
   timeout 60s bash -c 'until docker compose exec -T db pg_isready -U goomer -d goomer; do sleep 2; done'
```

- Timeout de 60 segundos
- Verifica a cada 2 segundos se o banco está aceitando conexões
- Usa `pg_isready` para validação

3. **Executa migrations**

```bash
   bun run migrate
```

- Garante que o schema do banco está atualizado
- Necessário antes de rodar os testes

4. **Roda testes unitários**

```bash
   bun test
```

5. **Roda testes E2E**

```bash
   bun test:e2e
```

6. **Cleanup (sempre executa)**

```bash
   docker compose down -v
```

- Remove containers e volumes
- Garante ambiente limpo para próxima execução
- Executa mesmo se os testes falharem (`if: always()`)

### Estratégias de Otimização

#### **Concurrency Control**

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

- Cancela workflows anteriores do mesmo PR que ainda estão rodando
- Economiza recursos e tempo de execução
- Útil quando há múltiplos commits em sequência

#### **Cache de Dependências**

```yaml
- name: Restore Bun cache
  uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('bun.lock') }}
    restore-keys: |
      ${{ runner.os }}-bun-
```

**Como funciona:**

- Gera uma chave única baseada no `bun.lock`
- Se o lockfile não mudou, restaura cache anterior
- Reduz tempo de instalação de ~30s para ~5s

#### **Jobs em Paralelo com Dependências**

```yaml
build:
  needs: setup

test:
  needs: setup
```

- `Build` e `Tests` rodam em paralelo
- Ambos dependem apenas do `Setup`
- Reduz tempo total de execução

### Triggers e Paths

O workflow só roda quando há mudanças relevantes:

```yaml
on:
  pull_request:
    paths:
      - "src/**"
      - "package.json"
      - "bun.lock"
      - "docker-compose.yml"
      - "Dockerfile"
```

**Vantagens:**

- Não roda em mudanças no README ou arquivos de documentação
- Economiza minutos de Actions
- Feedback mais rápido para mudanças relevantes

### Validação de Lockfile

```bash
bun install --frozen-lockfile
```

**Por que `--frozen-lockfile`?**

- Garante que o `bun.lock` está sincronizado com `package.json`
- Previne instalações inconsistentes entre ambientes
- Falha se alguém esqueceu de commitar o lockfile atualizado
- Boa prática para builds reproduzíveis

### Monitoramento e Debugging

Cada step do workflow pode ser inspecionado:

1. **Logs detalhados**: Clique em qualquer job para ver logs completos
2. **Artifacts**: Possibilidade de salvar arquivos gerados (não configurado ainda)
3. **Annotations**: Erros aparecem diretamente nos arquivos no PR
4. **Status badges**: Badge no README mostra status atual do CI

### Melhorias Futuras no CI/CD

Possíveis expansões do workflow:

- **Code Coverage Reports**: Upload de relatórios de cobertura para Codecov
- **Linting**: Adicionar job de lint com ESLint/Biome
- **Security Scanning**: Análise de vulnerabilidades com Snyk ou Dependabot
- **Performance Tests**: Testes de carga e performance
- **Deploy Automático**: CD para staging/production após merge
- **Notifications**: Integração com Slack/Discord para notificar falhas
- **Matrix Strategy**: Testar em múltiplas versões do Bun/Node
- **Docker Build**: Build e push de imagens Docker para registry

### Comandos Úteis para Debug

Se um workflow falhar, você pode reproduzir localmente:

```bash
# Simular ambiente de CI localmente
docker compose up -d db
bun install --frozen-lockfile
bun run migrate
bun test
bun test:e2e
docker compose down -v
```

### Proteção de Branches

Para garantir qualidade, é recomendado configurar branch protection:

**GitHub → Settings → Branches → Add rule:**

- [x] Require status checks to pass before merging
- [x] Require branches to be up to date before merging
- [x] Status checks: `Setup`, `Build Check`, `Tests`

Isso impede merge de código que:

- Não compila
- Falha em testes
- Tem lockfile desatualizado

---

## Desafios e Soluções

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
- Type casting quando necessário

### 4. Configuração do Docker vs Servidor Local

**Desafio**: Durante desenvolvimento, às vezes o Docker ocupava a porta causando conflitos.

**Solução**:

- Implementação de tratamento de erro `EADDRINUSE`
- Mensagens claras sobre portas ocupadas
- Script para verificar processos

### 5. Estrutura de Promoções Complexa

**Desafio**: Promoções ativas apenas em dias/horários específicos.

**Solução**:

- Armazenamento de dias como array de strings no banco
- Lógica de validação no use case `GetMenuUseCase`
- Comparação de dia e horário considerando timezone

### 6. CI/CD com Bun e Docker

**Desafio**: Configurar pipeline de CI que roda testes com banco de dados real.

**Solução**:

- Uso do GitHub Actions com Docker Compose
- Versionamento correto do Bun (1.3.1)
- Strategy de cache para otimizar tempo de build
- Validação com `--frozen-lockfile` para garantir consistência

---

## Estrutura do Projeto

```
goomer-api/
├── .github/
│   └── workflows/
│       └── checks-backend.yml
├── drizzle/
├── scripts/
├── src/
│   ├── core/
│   ├── domain/
│   └── infra/
├── test/
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vite.config.e2e.ts
└── README.md
```

---

## Docker

### Serviços Disponíveis

O `docker-compose.yml` configura:

1. **PostgreSQL** (porta 5432)

   - User: `goomer`
   - Password: `goomer`
   - Database: `goomer`

2. **API** (porta 3333)
   - Roda automaticamente migrations
   - Hot reload habilitado

### Comandos Úteis

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes (limpa banco)
docker-compose down -v

# Rebuild da imagem
docker-compose up --build

# Executar comando no container
docker-compose exec api bun test
```

---

## Variáveis de Ambiente

| Variável       | Descrição                      | Padrão        | Obrigatório |
| -------------- | ------------------------------ | ------------- | ----------- |
| `DATABASE_URL` | URL de conexão PostgreSQL      | -             | Sim         |
| `PORT`         | Porta do servidor              | `3333`        | Não         |
| `NODE_ENV`     | Ambiente de execução           | `development` | Não         |
| `ENABLE_DOCS`  | Habilitar documentação Swagger | `true`        | Não         |

---

## Padrões e Boas Práticas

### Commits

- Commits pequenos e descritivos
- Conventional Commits (feat, fix, docs, chore, test, ci)
- Mensagens em português

### Code Style

- TypeScript strict mode habilitado
- Nomenclatura clara e descritiva
- Separação de responsabilidades
- Princípios SOLID aplicados

### Segurança

- Validação de entrada com Zod
- Prepared statements (proteção contra SQL injection)
- Variáveis de ambiente para dados sensíveis
- Validações em camadas (controller + use case + entity)

### CI/CD

- Testes automatizados em cada PR
- Validação de lockfile para builds reproduzíveis
- Cache de dependências para otimização
- Ambiente isolado com Docker para testes

---

## Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

## Autor

Desenvolvido por **Paulo Barbosa** como parte do desafio técnico da Goomer.

- GitHub: [@itspaulin](https://github.com/itspaulin)
