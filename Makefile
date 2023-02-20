.env:
	cp .env.dist .env

install: .env node_modules start_db build
	pnpm prisma db push

start_db:
	docker compose up -d

stop_db:
	docker compose stop

build:
	pnpm run build

node_modules:
	pnpm install
