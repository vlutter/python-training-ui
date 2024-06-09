# Установим базовый образ Node.js
FROM node:20-alpine as build

# Установим рабочую директорию
WORKDIR /app

# Скопируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Установим зависимости
RUN yarn install

# Скопируем все файлы проекта
COPY . .

# Соберем проект
RUN yarn build

# Используем nginx для сервировки статических файлов
FROM nginx:alpine

# Копируем файлы сборки из предыдущего контейнера
COPY --from=build /app/dist/python-training-ui/browser /usr/share/nginx/html

# Откроем порт 80
EXPOSE 80

# Запустим nginx
CMD ["nginx", "-g", "daemon off;"]
