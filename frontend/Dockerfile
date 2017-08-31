FROM node:boron as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install

FROM nginx:1.13
COPY --from=builder /usr/src/app/ /usr/share/nginx/html

