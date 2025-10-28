# Use Bun oficial como base
FROM oven/bun:1
WORKDIR /app

# Instalar dependências
COPY package.json ./
COPY bun.lock* ./
RUN bun install --frozen-lockfile

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3333

# Comando para rodar
CMD ["sh", "-c", "bun run migrate && bun run dev"]