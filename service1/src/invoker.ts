import { trace, context, propagation, SpanStatusCode } from '@opentelemetry/api';

const tracerName = process.env.SERVICE_NAME || 'service1';
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
  // get a tracer from global trace provider
  const tracer = trace.getTracer(tracerName);
  // Extract trace context from parent context
  const span = tracer.startSpan(`make API call`, {}, context.active());

  try {
    // Convert trace context to headers
    const traceHeaders = {};
    propagation.inject(context.active(), traceHeaders);

    const url = `${process.env.SERVICE2_ENDPOINT}${options.url}`;
    const requestOptions = {
      method: options.method,
      headers: {
        ...defaultHeaders,
        ...traceHeaders,
      },
      body: JSON.stringify(options.payload),
    };
    // Log a message with trace information
    console.log(`API Call: ${options.method} ${options.url}, Trace ID: ${span.spanContext().traceId}`);

    const response: Response = await fetch(url, requestOptions);
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
    // Log an error message with trace information
    console.error(
      `API Call Error: ${options.method} ${options.url}, Trace ID: ${
        span.spanContext().traceId
      }}, Error: ${errorMessage}`,
    );
  } finally {
    span.end();
  }
};
