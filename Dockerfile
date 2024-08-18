FROM node:lts

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN npm install -g typescript
RUN pnpm install
RUN pnpm build

EXPOSE 8000

CMD ["pnpm", "run", "start"]