This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Parent dependencies
Please consider the changes below into the `../docker-compose.yaml`

```yaml
version: "3.8"

services:
  payment-db:
    image: mysql:latest
    restart: unless-stopped
    env_file:
      - ./.env
    volumes:
      - ./data:/var/lib/mysql
    networks:
      - paymentnetwork
    ports:
      - "3306:3306"

  payment-redis:
    image: redis:latest
    restart: unless-stopped
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - paymentnetwork
    env_file:
      - ./.env

  phpmyadmin:
    depends_on:
      - payment-db
    image: phpmyadmin/phpmyadmin
    restart: unless-stopped
    env_file:
      - ./.env
    networks:
      - paymentnetwork

  payment-frontend:
    build:
      context: ./payment-frontend
      dockerfile: Dockerfile
    restart: unless-stopped
    networks:
      - paymentnetwork
    env_file:
      - ./.env
    develop:
      watch:
        - action: sync
          path: payment-frontend/
          target: /app/
        - action: rebuild
          path: ./payment-frontend/package.json

  payment-backend:
    build:
      context: ./payment-backend
      dockerfile: Dockerfile
    restart: unless-stopped
    develop:
      watch:
        - action: sync
          path: payment-backend/
          target: /app/
        - action: rebuild
          path: ./payment-backend/package.json
    env_file:
      - ./.env
    networks:
      - paymentnetwork
    depends_on:
      - payment-db
      - payment-redis

  nginx:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - "3010:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - payment-frontend
      - payment-backend
      - payment-db
      - phpmyadmin
    networks:
      - paymentnetwork

networks:
  paymentnetwork:
    driver: bridge

volumes:
  db_payment:
  redis_data:
```