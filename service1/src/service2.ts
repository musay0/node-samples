import dotenv from 'dotenv';
// load env variables from .env
dotenv.config();

// setup Instrumentation
import { setupInstrumentation } from './instrumentation';

setupInstrumentation();

// regular express stuff
import express, { Express, Request, Response } from 'express';
import logger from './logger';

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

// simulate an endpoint that returns valid data
app.post('/valid', async (req: Request, res: Response) => {
  logger.info('valid scenario invoked');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // send 200 status code and original payload in data attribute
  res.status(200).send({
    data: req.body,
  });
});

// simulate a broken endpoint
app.post('/invalid', async (req: Request, res: Response) => {
  logger.info('invalid scenario invoked');
  // add a delay of 3 seconds before sending an error response
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // send 400 status code and original payload in data attribute
  res.status(400).send({
    data: req.body,
  });
});

// start listening
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
