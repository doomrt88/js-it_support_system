# download node image
FROM node:16

# set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt module
#RUN npm rebuild bcrypt --build-from-source
RUN npm install bcrypt@5.1.1

# Copy the rest of the source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
