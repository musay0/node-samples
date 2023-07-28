## service1

This is a starter for node + express service written using typescript

### Build and exec commands
```
# build the source
yarn build

# start server
yarn start

# start server for dev, live reload enabled
yarn dev

# fix linting
yarn lint:fix
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
arn add concurrently nodemon  --dev
```