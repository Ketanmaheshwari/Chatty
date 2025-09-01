// Importing Express framework. "Express" is also imported as a type for type safety.
import express, { Express } from 'express';

// Importing custom server setup class (where all Express routes, middlewares, socket setup, etc. are managed).
import { ChattyServer } from '@root/setupServer';

// Importing the function that initializes the database connection.
import databaseConnection from '@root/setupDatabase';

// Importing configuration settings (environment variables, validation, etc.).
import { config } from '@root/config';

// Main Application class that bootstraps the whole project
class Application {
  // Entry point: initializes and starts the application
  public initialize(): void {
    // Load and validate environment variables (ensures all required config values exist)
    this.loadConfig();

    // Establish connection with the database (e.g., MongoDB, Redis, etc.)
    databaseConnection();

    // Create an Express application instance
    const app: Express = express();

    // Initialize custom server logic (routes, middleware, WebSockets, etc.)
    const server: ChattyServer = new ChattyServer(app);

    // Start the server (listen on a specific port and begin handling requests)
    server.start();
  }

  // Helper method to load and validate configuration
  private loadConfig(): void {
    // Calls a method inside config that ensures env variables are present and correct
    config.validatedConfig();
    
    // Configure cloudinary with credentials from config
    config.cloudinaryConfig();
  }
}

// Create an instance of Application and start it
const application: Application = new Application();
application.initialize();
