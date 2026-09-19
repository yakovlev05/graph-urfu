# Граф студентов УрФУ

Вершины — студенты, рёбра — студенты учились в одной группе.

## Стек

- React + TypeScript + Vite
- [react-force-graph-2d](https://github.com/vasturiano/react-force-graph) — отрисовка графа на canvas и force-раскладка (d3-force)

Данные — `../prepare-data/graph_data.json`, их готовит модуль `prepare-data`.
Приложение загружает их по адресу `/data/graph_data.json`.

## Локальная разработка

Поднять сервер с данными (из папки `webapp-react`):

```bash
python3 -m http.server 8888 --directory ../prepare-data
```

В другом терминале запустить приложение:

```bash
npm install
npm run dev
```

Vite проксирует `/data/*` на `localhost:8888` (см. `vite.config.ts`).

## Docker

Образ собирает приложение и отдаёт его через nginx вместе с данными (`nginx.conf`).
Сборку запускать из корня репозитория:

```bash
docker build -f webapp-react/Dockerfile -t graph-urfu .
docker run --rm -p 8080:80 graph-urfu
```

Приложение будет доступно на http://localhost:8080.
