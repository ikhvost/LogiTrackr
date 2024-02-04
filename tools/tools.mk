WITH_TOOLS_ENV = set -o allexport; source tools/db.env; set +o allexport;
TOOLS_COMPOSE = $(WITH_TOOLS_ENV) docker-compose -f tools/docker-compose.yml

db@up: ## Start the local database
db@up: TOOLS=docker docker-compose
db@up: _assert-tools
db@up:
	@$(TOOLS_COMPOSE) up -d db

db@stop: ## Stop the local database
db@stop: TOOLS=docker docker-compose
db@stop: _assert-tools
db@stop:
	@$(TOOLS_COMPOSE) stop db

db@down: ## Remove the local database
db@down: TOOLS=docker docker-compose
db@down: _assert-tools
db@down:
	@$(TOOLS_COMPOSE) down --remove-orphans

db@logs: ## Show logs from the local database
db@logs: TOOLS=docker docker-compose
db@logs: _assert-tools
db@logs:
	@$(TOOLS_COMPOSE) logs -f db

db@generate: ## Generate new migration file
db@generate: TOOLS=node
db@generate: _assert-tools
db@generate:
	@cd packages/backend && \
		./node_modules/.bin/drizzle-kit generate:pg --config=./database/config.ts

.ONESHELL:
db@migrate: ## Migrate database for given ENV
db@migrate: TOOLS=node
db@migrate: _assert-tools
db@migrate:
	@cd packages/backend
	@./node_modules/.bin/sls invoke $(and $(findstring dev,$(ENV)),local) \
		-f migrate \
		-s $(ENV) \
		-d '{ "op": "run" }'

.ONESHELL:
db@revert: ## Revert database to TARGET_MIGRATION for given ENV
db@revert: TOOLS=node
db@revert: _assert-tools
db@revert:
	@cd packages/backend
	@./node_modules/.bin/sls invoke $(and $(findstring dev,$(ENV)),local) \
		-f migrate \
		-s $(ENV) \
		-d '{ "op": "revert", "targetMigration": "$(TARGET_MIGRATION)" }'
