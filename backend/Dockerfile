FROM node:20-alpine

WORKDIR /app

# Install dependencies first (separate layer — faster rebuilds)
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Generate Prisma client compiled for Linux/Alpine
RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "dev"]