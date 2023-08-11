## service1

This is a starter for node + express service written using typescript

### start zipkin service
```
docker run -d -p 9411:9411 openzipkin/zipkin
```

### Build and exec commands
```
# fix linting
yarn lint:fix

# build the source
yarn build

# start server for simultaing other service2,
yarn start:service2

# start service1 for dev, live reload enabled
yarn dev

# start service1
yarn start
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
