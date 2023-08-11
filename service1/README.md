## service1

This is a starter for node + express service written using typescript

### start zipkin service
```
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
# start server for simultaing other service2,
yarn start:service2

# start service1 for dev, live reload enabled
yarn dev

# start service1
yarn start
```

### Command to invoke the API's
```
# call test api for valid scenario
curl 'http://localhost:8080/test/valid'

# call test api for invalid scenario
curl 'http://localhost:8080/test/valid1'
```

### project setup commands 
(first time use only)
```
# initializing the project 
yarn init --yes

# install the basic packages
yarn add express dotenv

# installing typescript
yarn add typescript @types/express @types/node --dev

# generating tsconfig.json
npx tsc --init

# watch changes to file and live reload for dev
yarn add concurrently nodemon  --dev
```
