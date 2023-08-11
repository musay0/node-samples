import dotenv from 'dotenv';
// load env variables from .env
dotenv.config();

// setup Instrumentation
import { setupInstrumentation } from './instrumentation';
const serviceName = process.env.SERVICE_NAME || 'service1';
setupInstrumentation(serviceName);

// regular express stuff
import express, { Express, Request, Response } from 'express';
import { makeAPICall } from './invoker';
import logger from './logger';

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

/**
 * A test endpoint where you can pass path param as 'valid' or 'invalid'
 */
app.get('/test/:scenario', async (req: Request, res: Response) => {
  const scenario = req.params.scenario === 'valid' ? 'valid' : 'invalid';
  logger.info(`Executing scenario: ${scenario}`);
  const data = await makeAPICall({
    method: 'POST',
    url: `/${scenario}`,
    payload: {
      name: 'tester1',
    },
  });
  res.status(200).json(data);
});

// simulate an endpoint that returns valid data
app.post('/valid', (req: Request, res: Response) => {
  logger.info('valid scenario invoked');
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
