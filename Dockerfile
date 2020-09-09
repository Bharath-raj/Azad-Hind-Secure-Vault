FROM alpine:latest
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY package*.json ./
COPY . /app
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["main.js"]
