# Use Bun oficial como base
FROM oven/bun:1 AS base
WORKDIR /app

# Instalar dependências (camada de cache)
FROM base AS install
COPY package.json ./
COPY bun.lock* ./
RUN bun install --frozen-lockfile

# Copiar código fonte
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Build TypeScript (se necessário)
# RUN bun build

# Produção
FROM base AS production
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app .

# Expor porta
EXPOSE 3000

# Comando para rodar
CMD ["bun", "run", "dev"]