FROM node:24-alpine AS build
WORKDIR /app
COPY webapp-react/package.json webapp-react/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY webapp-react/ ./
RUN npm run build

FROM nginx:stable-alpine
COPY webapp-react/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /myapp
COPY prepare-data/graph_data.json /myapp/data/graph_data.json
