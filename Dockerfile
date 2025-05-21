# Usa imagem leve do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package.json package-lock.json ./

# Garante que não há cache quebrado
RUN rm -rf node_modules

# Instala dependências no ambiente Linux do container
RUN npm install

# Copia o restante dos arquivos da aplicação (sem sobrescrever node_modules)    
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para rodar com hot reload e permitir acesso externo
CMD ["npm", "run", "dev", "--", "--host"]
