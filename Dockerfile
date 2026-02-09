# Etapa 1: build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Gera o build de produção
RUN npm run build

# Etapa 2: servidor para rodar o app
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos do build
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instala o servidor estático (serve)
RUN npm install -g serve

# Expõe a porta padrão do Vite/Serve
EXPOSE 5173

# Comando para servir o build
CMD ["serve", "-s", "dist", "-l", "5173"]
