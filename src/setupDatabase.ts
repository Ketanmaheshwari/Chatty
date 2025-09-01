// Import Mongoose to interact with MongoDB
import mongoose from 'mongoose';
// Import central configuration file (with DB URL and logger config)
import { config } from '@root/config';
// Import bunyan Logger type
import Logger from 'bunyan';

// Create a logger instance specific to database setup logs
const log: Logger = config.createLogger('setupDatabase');

// Default export is a function (called during app startup) that handles DB connection setup
export default () => {
  // Inner function that actually connects to MongoDB
  const connect = () => {
    mongoose
      // Attempt to connect using the DATABASE_URL from config
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        // If successful → log success message
        log.info('Successfully connected to database.');
      })
      .catch((error) => {
        // If failed → log error message with details
        log.error('Error in the database.', error);

        // Exit the Node.js process with status code 1 (failure)
        // Ensures app won't run without DB connection
        return process.exit(1);
      });
  };

  // Call the connect function immediately when this file runs
  connect();

  // If the connection gets disconnected at any point,
  // Mongoose will automatically try to reconnect by calling connect() again
  mongoose.connection.on('disconnected', connect);
};
