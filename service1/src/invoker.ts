import { trace, context, propagation, Span, SpanStatusCode } from '@opentelemetry/api';
import logger from './logger';

const serviceName = process.env.SERVICE_NAME || 'service1';

// default headers for JSON
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
};

/**
 * Make an API call with tracing.
 *
 * @param {Object} options - The options for the API call.
 * @param {string} options.method - The HTTP method.
 * @param {string} options.url - The URL for the API call.
 * @param {Object} options.payload - The payload for the API call.
 * @return {Promise<any>} A promise that resolves with the API response.
 */
export const makeAPICall = async (options: { method: string; url: string; payload: object }) => {
  const tracer = trace.getTracer(serviceName);
  return tracer.startActiveSpan('make API call', async (span: Span) => {
    try {
      const traceHeaders = {};
      // inject context to trace headers for propagtion to the next service
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

      logger.info(`API Call: ${options.method} ${options.url}, spanId[${span.spanContext().spanId}]`);
      const response: Response = await fetch(requestUrl, requestOptions);
      // fetch does not error on HTTP 400 > 600, hence explicitly break
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      span.setStatus({ code: SpanStatusCode.OK });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API invocation error: cause unknown';
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorMessage,
      });
      logger.error(`API Call Error: ${options.method} ${options.url}, Error: ${errorMessage}`);
      // throw error;
    } finally {
      span.end();
    }
  });
};
