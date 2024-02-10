# docker build . -t capstone-client
# docker run -p 10000:10000 capstone-client

FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json .
RUN npm install --ignore-scripts
COPY src/ src/
COPY public/ public/
COPY vite.config.js .
RUN npm run build

FROM node:20-alpine
RUN adduser -D static
USER root
WORKDIR /home/static
COPY --from=build-stage /app/dist .
RUN npm install -g http-server
EXPOSE 10000
CMD ["http-server", "-p", "10000", "--proxy", "http://localhost:10000?"]
