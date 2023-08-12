'use strict';

import { trace } from '@opentelemetry/api';

// Not functionally required but gives some insight what happens behind the scenes
// import { trace, diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

const serviceName = process.env.SERVICE_NAME || 'service1';

/**
 * Method to setup instrumentation, can be parametarized or refactored to make it config based
 *
 * @return {Tracer} returns the tracer created for instrumentation
 */
export const setupInstrumentation = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      // winston instrumentation for logger
      new WinstonInstrumentation({
        // Optional hook to insert additional context to log metadata.
        // Called after trace context is injected to metadata.
        logHook: (span, record) => {
          record['resource.service.name'] = serviceName;
        },
      }),
    ],
  });

  // check if want to print spans to console using environment variable
  if (process.env.ENABLE_CONSOLE_SPAN_EXPORTER === 'true') {
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  // Using Zipkin exporter, but any other exporter can be used as well
  const exporter = new ZipkinExporter({
    serviceName: serviceName,
    url: process.env.ZIPKIN_ENDPOINT,
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return trace.getTracer(serviceName);
};
