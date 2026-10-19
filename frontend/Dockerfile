FROM nginx:alpine

# Копируем конфиг nginx (сервер-блок)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранную статику в стандартную папку nginx
COPY dist/ /usr/share/nginx/html

EXPOSE 80