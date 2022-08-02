project_name=$(shell basename $(shell pwd))
network_name=$(project_name)
db_name=$(project_name)-db
image_repo=327629349255.dkr.ecr.us-east-1.amazonaws.com/correx
version ?= latest
ports ?= -p 3000:3000 -p 10000:10000
mounts ?= -v $(shell pwd):/home/dev/app
uid ?= $(shell id -u)
user ?= --user $(uid)
network=--network $(network_name)

.PHONY: help
help: ## Display this help section.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

network: ## Create the container network.
	docker inspect $(network_name) 2>&1 > /dev/null || docker network create $(network_name)

db-volume: ## Create the database volumes.
	docker volume inspect $(db_name) &> /dev/null || docker volume create $(db_name)

db: db-volume network ## Create the database container.
	docker run --rm -d --env-file .env $(network) --network-alias db -p 5432:5432 --name $(db_name) -v $(db_name):/var/lib/postgresql/data postgres:13

db-shell: ## Start a shell in the db container.
	docker run --rm -it $(network) --name $(db_name)-shell postgres:13 psql -h db -U dev -W -d correx

db-migrate: ## Migrate the database.
	npm run migration:dev

db-rm:
	docker rm -f $(db_name)
	docker volume rm $(db_name)

image:
	docker buildx rm $(project_name) || true
	docker buildx create --name $(project_name) --driver docker-container --use
	#linux/amd64,
	docker buildx build --progress plain --platform linux/arm64 -t $(image_repo):$(version) --push .

ecr_login:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 327629349255.dkr.ecr.us-east-1.amazonaws.com

push_image:
	docker push $(image_repo):$(version)

jaeger:
	docker run --rm -d --name jaeger -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 -p 5775:5775/udp -p 6831:6831/udp -p 6832:6832/udp -p 5778:5778 -p 16686:16686 -p 14268:14268 -p 14250:14250 -p 9411:9411 jaegertracing/all-in-one:latest

dev_image:
	docker build --build-arg uid=$(uid) -t $(image_repo) .

shell: dev_image
	docker run --rm -it $(network) $(mounts) $(ports) $(user) $(image_repo) /bin/bash
