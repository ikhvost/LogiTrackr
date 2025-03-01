WITH_TOOLS_ENV = set -o allexport; source tools/db.env; set +o allexport;
TOOLS_COMPOSE = $(WITH_TOOLS_ENV) docker compose -f tools/docker-compose.yml

_ensure_audit_db_connection:
	@if [ -z "$$DATABASE_CONNECTION" ]; then \
		$(WITH_TOOLS_ENV) \
		export DATABASE_CONNECTION="postgresql://$$POSTGRES_USER:$$POSTGRES_PASSWORD@$$POSTGRES_PORT:$$POSTGRES_PORT/$$POSTGRES_DB"; \
	fi

db@up: ## Start the local database
db@up: TOOLS=docker
db@up: _assert_tools
db@up:
	@$(TOOLS_COMPOSE) up -d db

db@stop: ## Stop the local database
db@stop: TOOLS=docker
db@stop: _assert_tools
db@stop:
	@$(TOOLS_COMPOSE) stop db

db@down: ## Remove the local database
db@down: TOOLS=docker
db@down: _assert_tools
db@down:
	@$(TOOLS_COMPOSE) down --remove-orphans

db@logs: ## Show logs from the local database
db@logs: TOOLS=docker
db@logs: _assert_tools
db@logs:
	@$(TOOLS_COMPOSE) logs -f db

db@generate: ## Generate new migration file
db@generate: TOOLS=node
db@generate: _assert_tools
db@genarete: _ensure_audit_db_connection
db@generate:
	@cd packages/backend && \
		./node_modules/.bin/drizzle-kit generate --config=./src/core/migrator.ts

db@migrate: ## Migrate database
db@migrate: TOOLS=node
db@migrate: _assert_tools
db@migrate: _ensure_audit_db_connection
db@migrate:
	@cd packages/backend && \
		./node_modules/.bin/drizzle-kit migrate --config=./src/core/migrator.ts

db@dashboard: ## Open Drizzle-kit Studio
db@dashboard: TOOLS=node
db@dashboard: _assert_tools
db@dashboard: _ensure_audit_db_connection
db@dashboard:
	@cd packages/backend && \
		./node_modules/.bin/drizzle-kit studio --config=./src/core/migrator.ts

db@seed: ## Seed database
db@seed: TOOLS=node
db@seed: _assert_tools
db@seed: _ensure_audit_db_connection
db@seed:
	@cd packages/backend && \
		./node_modules/.bin/tsx ./tests/seed.ts

dev@db: ## Setup test database with migrations and seed data
dev@db: TOOLS=node
dev@db: _assert_tools
dev@db: _ensure_audit_db_connection
dev@db:
	@$(MAKE) db@up
	@echo "Waiting for database to be ready..."
	@sleep 5
	@$(MAKE) db@migrate
	@$(MAKE) db@seed

dev@backend: ## Start the backend
dev@backend: TOOLS=node
dev@backend: _assert_tools
dev@backend:
	@cd packages/backend && \
		pnpm run watch

dev@ui: ## Start the frontend
dev@ui: TOOLS=node
dev@ui: _assert_tools
dev@ui:
	@cd packages/ui && \
		pnpm run watch
