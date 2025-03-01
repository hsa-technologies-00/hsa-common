import { Server } from 'http';
import mongoose from 'mongoose';
import { logger } from '../logger';

export const handledGracefulShutdown = async (server: Server, mongoConnection: mongoose.Connection): Promise<void> => {
  const shutdown = async (server: Server, mongoConnection: mongoose.Connection): Promise<void> => {
    try {
      logger.info('Shutting down server...');
      server.close(async () => {
        logger.info('Server is closed.');

        if (mongoConnection.readyState === 1) {
          await mongoConnection.close();
          logger.info('MongoDB connection is closed.');
        }

        process.exit(0);
      });
    } catch (err) {
      logger.error('Error occurred during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('uncaughtException', async (err) => {
    logger.error('Uncaught exception occurred:', err);
    await shutdown(server, mongoConnection);
  });

  process.on('unhandledRejection', async (err) => {
    logger.error('Unhandled rejection occurred:', err);
    await shutdown(server, mongoConnection);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received.');
    await shutdown(server, mongoConnection);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received.');
    await shutdown(server, mongoConnection);
  });
};
