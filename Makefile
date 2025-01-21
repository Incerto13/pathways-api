docker-clean:
	@containers=$$(docker ps -q); \
	if [ -n "$$containers" ]; then \
		echo "Stoppig all running containers..."; \
		docker stop $$containers; \
	else \
		echo "No running containers to stop."; \
	fi
	docker system prune -af
