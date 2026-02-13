# Makefile for Upwork WhatsApp Bridge

.PHONY: help build start stop restart logs test clean rebuild

help: ## Show this help message
	@echo "Upwork WhatsApp Bridge - Docker Commands"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the Docker image
	docker-compose build

start: ## Start the container
	docker-compose up -d
	@echo "✅ Container started!"
	@echo "📱 Scan QR: http://localhost:3000/qr"
	@echo "📊 View logs: make logs"

stop: ## Stop the container
	docker-compose down
	@echo "✅ Container stopped!"

restart: ## Restart the container
	docker-compose restart
	@echo "✅ Container restarted!"

logs: ## View container logs (live)
	docker-compose logs -f

test: ## Send a test message
	@echo "Sending test message..."
	@curl -X POST http://localhost:3000/test
	@echo "\n✅ Check your WhatsApp!"

status: ## Check container status
	docker-compose ps

clean: ## Stop and remove containers (keeps session data)
	docker-compose down
	@echo "⚠️  Container removed. Session data preserved."

clean-all: ## Remove everything including session data
	docker-compose down -v
	@echo "⚠️  Everything removed! You'll need to re-scan QR code."

rebuild: ## Rebuild and restart (after code changes)
	docker-compose up -d --build
	@echo "✅ Rebuilt and restarted!"

shell: ## Open shell in running container
	docker-compose exec upwork-whatsapp-bridge /bin/bash

qr: ## Open QR code in browser
	@echo "Opening QR code in browser..."
	@open http://localhost:3000/qr || xdg-open http://localhost:3000/qr || start http://localhost:3000/qr

health: ## Check server health
	@curl -s http://localhost:3000/ | python3 -m json.tool

backup: ## Backup WhatsApp session
	@mkdir -p backups
	@docker cp upwork-whatsapp-bridge:/app/.wwebjs_auth ./backups/session-$(shell date +%Y%m%d-%H%M%S)
	@echo "✅ Session backed up to backups/"
