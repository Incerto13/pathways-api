## Description
- This is a Nest.js REST API that satisfies the Pathways technical requirements
- Implements and passes integration tests
- Utilizes Typescript, MongoDB, Rabbitmq as an event/queue broker
- Utilizes Dockerfiles and docker-compose.yml files for everything (except the integrations tests)
- Has swagger documentation for each endpoint
- Also utilizes mongo-express and rabbitmq-3-management for ui inssight into the database and event queue

## Installation

```bash
npm install
```

## Running the app

```bash
# start development evironment (api, mongodb, and rabbitmq)
docker compose up --build
```
- REST api will be running on `http://localhost:3000/api` [http://localhost:3000/api](http://localhost:3000/api)
- database ui will be running on `http://localhost:8081` [http://localhost:8081](http://localhost:8081)
- rabbitmq ui will be running on `http://localhost:15672` [http://localhost:15672](http://localhost:15672)  { username: guest, password: guest }

## Documentation
swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)


## Testing
#### prerequisites
- db and server should be running

```bash
npm run int-test
```

## Docker
#### useful commands

```bash
# stop all running containers
make docker-clean
```