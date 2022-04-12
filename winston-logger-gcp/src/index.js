import getLogger from './logger.js';

const LOG = getLogger(import.meta);
/**
 * test the logs
 */
function test() {
  try {
    LOG.info('---', {'req': 'req1'});
    LOG.error('Some error');
    const arr = null;
    LOG.info(`${arr[1]} out`);
  } catch (e) {
    LOG.error('Some error', e);
  }
}
test();
