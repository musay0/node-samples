import path from 'path';
import {createLogger, format} from 'winston';
import {LoggingWinston} from '@google-cloud/logging-winston';

/** ES module to enable adding meta info like file, function, line number to a log **/
const winstonLogger = new LoggingWinston({
  redirectToStdout: true,
  prefix: 'some prefix',
  handleExceptions: false,
});

/**
 * @param {Object} callingModule
 * @return {Function}
 */
function metaFromStack(callingModule) {
  const defaultMeta = {
    file: path.basename(callingModule.url),
  };
  return format((info, opts) => {
    const stackMeta = getMetaFromStack(info);
    if (stackMeta && !stackMeta.file) {
      stackMeta.file = defaultMeta.file;
    }
    const meta = stackMeta ? stackMeta: defaultMeta;
    return {...info, ...meta};
  });
}

const getMetaFromStack = function(info) {
  if (info.stack) {
    const stack = info.stack;
    const frame = (stack.split('\n')[1]).trim().split(' ');
    // sample: frame[2] (file:///C://src/index.js:11:20)
    const pathStr = frame[2].replace(/\(|\)/g, ''); // file:///C://src/index.js:11:20
    const line = path.basename(pathStr); // index.js:11:20
    const index = line.indexOf(':');
    return {
      function: frame[1],
      line: line.substring(index + 1, line.length), // 11:20
      file: line.substring(0, index), // index.js
    };
  }
  return null;
};

/**
 * @param {Object} callingModule
 * @return {Object} logger object
 */
export default function(callingModule) {
  return createLogger({
    format: format.combine(
        metaFromStack(callingModule)(),
    ),
    transports: [
      winstonLogger,
    ],
  });
}
