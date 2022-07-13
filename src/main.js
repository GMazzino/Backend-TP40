import os from 'os';
import cluster from 'cluster';
import { APP_MODE, PORT } from '../config.js';
import app from './server.js';
import logger from './utils/logger.js';

const cpus = os.cpus().length;

if (APP_MODE === 'CLUSTER') {
  if (cluster.isPrimary) {
    logger.info(`Starting server in CLUSTER mode\nParent PID #: ${process.pid}\n# of CPU's: ${cpus}`);
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    logger.info(`Child PID #: ${process.pid}`);
    app
      .listen(PORT, () => {
        logger.info(`Server running and listening on port ${PORT}`);
      })
      .on('error', (error) => logger.error(`Module: main.js -> ${error.message}`));
  }
} else {
  logger.info(`Starting server in FORK mode\nProcess PID #: ${process.pid}`);
  app
    .listen(PORT, () => {
      logger.info(`Server running and listening on port ${PORT}`);
    })
    .on('error', (error) => logger.error(`Module: main.js -> ${error.message}`));
}
