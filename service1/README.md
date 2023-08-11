# Node Backend with Instrumentation (opentelemetry)

This is a starter for a Node.js + Express service written in TypeScript. It utilizes OpenTelemetry for distributed tracing and includes a configuration for exporting traces to Zipkin. The service is equipped with a logger configured using OpenTelemetry, ensuring that trace and span IDs are seamlessly integrated into the logs. The project consists of two services: `service1`(index.ts) and `service2`(service2.ts).

## Getting Started

### Prerequisites

Make sure you have Docker installed to run the Zipkin service locally.

### Start Zipkin Service

```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

### Build commands
```
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

### Project Setup Commands (First Time Use Only)
```
# Initialize the project
yarn init --yes

# Install essential packages
yarn add express dotenv

# Install TypeScript and type declarations
yarn add typescript @types/express @types/node --dev

# Generate tsconfig.json
npx tsc --init

# Enable file watching and live reload for development
yarn add concurrently nodemon --dev
```

## Services Overview

This project includes two services:

1. **service1**(index.ts): The main Express service instrumented with OpenTelemetry. It provides endpoints to test API calls to `service2`.

2. **service2**(service2.ts): Simulates another service with endpoints for valid and invalid API responses. Delays are introduced to simulate realistic scenarios.
