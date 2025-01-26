# Basisimage für Node.js
FROM node:20

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Abhängigkeiten installieren
COPY package.json .
RUN npm install

# Code kopieren
COPY . .

# Startbefehl
CMD ["node", "index.js"]
