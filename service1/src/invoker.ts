import { trace, context, propagation, Span, SpanStatusCode } from '@opentelemetry/api';
import logger from './logger';

const tracerName = process.env.SERVICE_NAME ?? '';
// default headers for JSON
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
};

/**
 * Method responsible for wrapping the API calls with tracing
 *
 * @param {Object} options contains method, url, payload
 * @param {String} options.method HTTP method
 * @param {String} options.url endpoint
 * @param {Object} options.payload payload
 * @return {Object} data
 */
export const makeAPICall = async (options: { method: string; url: string; payload: object }) => {
  return new Promise(async (resolve, reject) => {
    // get a tracer from global trace provider
    const tracer = trace.getTracer(tracerName);

    // start active span with on the tracer, the logger automatically retreives the active span and populates traceId, spanId
    tracer.startActiveSpan(`make API call`, async (span) => {
      try {
        // Convert trace context to headers
        const traceHeaders = {};
        propagation.inject(context.active(), traceHeaders);

        const requestUrl = `${process.env.SERVICE2_ENDPOINT}${options.url}`;
        const requestOptions = {
          method: options.method,
          headers: {
            ...defaultHeaders,
            ...traceHeaders,
          },
          body: JSON.stringify(options.payload),
        };

        logger.info(`API Call: ${options.method} ${options.url} ${span.spanContext().spanId}`);
        const response: Response = await fetch(requestUrl, requestOptions);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        span.setStatus({ code: SpanStatusCode.OK });
        resolve(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'API invocation error: cause unknown';
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: errorMessage,
        });
        // Log an error message with trace information
        logger.error(`API Call Error: ${options.method} ${options.url}, Error: ${errorMessage}`);
        reject(error);
      } finally {
        span.end();
      }
    });
  });
};
