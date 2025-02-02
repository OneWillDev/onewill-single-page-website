FROM nginx:alpine
COPY ./index.html /usr/share/nginx/html
COPY ./public/ /usr/share/nginx/html/public
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
