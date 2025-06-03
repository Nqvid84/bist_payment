FROM docker.arvancloud.ir/node:22-alpine3.18 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

ARG VITE_API_ROOT
ARG VITE_KIBANA_API_ROOT
ARG VITE_ELASTIC_API_ROOT
ARG VITE_SOCKET_IO_ROOT

ENV VITE_API_ROOT=$VITE_API_ROOT
ENV VITE_KIBANA_API_ROOT=$VITE_KIBANA_API_ROOT
ENV VITE_ELASTIC_API_ROOT=$VITE_ELASTIC_API_ROOT
ENV VITE_SOCKET_IO_ROOT=$VITE_SOCKET_IO_ROOT

COPY . .
RUN yarn build

FROM docker.arvancloud.ir/node:22-alpine3.18

WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist /app


CMD ["serve", "-s", ".", "-l", "5173"]
