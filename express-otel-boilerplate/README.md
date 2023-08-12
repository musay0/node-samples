# Node Backend with Instrumentation (opentelemetry)

This is a starter for a [NodeJs](https://nodejs.org/en) + [Express.js](https://expressjs.com/) service written in [TypeScript](https://www.typescriptlang.org/). The project consists of two services: `service1`(index.ts) and `service2`(service2.ts).<br> 
It utilizes [OpenTelemetry](https://opentelemetry.io/) for distributed tracing and includes a configuration for exporting traces.<br>
The service is equipped with a logger ([WinstonJs](https://github.com/winstonjs/winston)) configured using OTel, ensuring tracing is seamlessly injected into the logs.<br> 

## Getting Started

### Prerequisites

Make sure you have [Docker](https://www.docker.com/) installed to run the [Jaeger service](https://www.jaegertracing.io/docs/1.47/getting-started/) locally.

### Start Jaeger Service
This will be reachable at [JaegerUI](http://localhost:16686/)
```bash
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.47
```

### Build commands
```
# install dependencies from package.json
yarn install

# fix linting
yarn lint:fix

# build the source
yarn build
```

### Execution commands
```
# Start service2 to simulate interactions
yarn start:service2

# Start service1 in development mode with live reload
yarn dev

# Start service1 in production mode
yarn start
```

### Command to invoke the API's
```
# call test api for valid scenario
curl 'http://localhost:8080/test/valid'

# call test api for invalid scenario
curl 'http://localhost:8080/test/valid1'
```


## Services Overview

This project includes two services:

1. **service1**(index.ts): The main Express service instrumented with OpenTelemetry. It provides endpoints to test API calls to `service2`.

2. **service2**(service2.ts): Simulates another service with endpoints for valid and invalid API responses. Delays are introduced to simulate realistic scenarios.
