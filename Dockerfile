FROM nginx:alpine
# Copiamos el dist que subiste por SCP
COPY ./dist /usr/share/nginx/html
# Copiamos la configuración que acabamos de crear
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
