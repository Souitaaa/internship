# MachinesInfos - Full-Stack Automation Makefile

.PHONY: help install start-backend start-frontend start-all build lint clean

help:
	@echo "======================================================================="
	@echo " MachinesInfos Industrial Dashboard - Automation Commands"
	@echo "======================================================================="
	@echo "  make install        - Install dependencies for both frontend and backend"
	@echo "  make start-backend  - Start the NestJS backend developer server"
	@echo "  make start-frontend - Start the Vite React frontend developer server"
	@echo "  make start-all      - Start both servers concurrently (using concurrently)"
	@echo "  make build          - Build both frontend and backend for production"
	@echo "  make lint           - Lint both frontend and backend codebases"
	@echo "  make clean          - Clean node_modules and distribution folders"
	@echo "======================================================================="

install:
	@echo ">>> Installing frontend (root) dependencies..."
	npm install
	@echo ">>> Installing backend dependencies..."
	cd backend && npm install

start-backend:
	@echo ">>> Starting NestJS backend server..."
	cd backend && npm run start:dev

start-frontend:
	@echo ">>> Starting Vite React frontend server..."
	npm run dev

start-all:
	@echo ">>> Starting both frontend and backend servers concurrently..."
	npx concurrently --kill-others \
		"npm run dev" \
		"cd backend && npm run start:dev"

build:
	@echo ">>> Building Vite React production bundle..."
	npm run build
	@echo ">>> Building NestJS backend production bundle..."
	cd backend && npm run build

lint:
	@echo ">>> Running ESLint checks..."
	npm run lint || true
	cd backend && npm run lint || true

clean:
	@echo ">>> Removing build artifacts and dependencies..."
	rm -rf dist
	rm -rf backend/dist
	rm -rf node_modules
	rm -rf backend/node_modules
