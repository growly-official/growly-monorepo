agent:
	docker buildx build --platform linux/amd64 -t growly-agent --load .
	docker compose -f docker-compose.yaml up