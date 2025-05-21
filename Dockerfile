# Usa imagem leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para rodar com hot reload e permitir acesso externo
CMD ["npm", "run", "dev", "--", "--host"]
