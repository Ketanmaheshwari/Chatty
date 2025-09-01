// Importing dotenv to load environment variables from a .env file into process.env
import dotenv from 'dotenv';

// Importing bunyan, a logging library for structured JSON-based logging
import bunyan from 'bunyan';

// Importing cloudinary for cloud-based image and video management
import cloudinary from 'cloudinary';
// Load environment variables from .env file (if available)
// dotenv.config() ensures that variables from .env are placed in process.env
dotenv.config({});

// Config class centralizes application configuration settings
class Config {
  // Public properties to hold various configuration values (env variables)
  public DATABASE_URL: string | undefined;
  public jWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;

  // Fallback URL in case DATABASE_URL is not defined in .env
  private readonly DEFAULT_DATABASE_URL = 'mongodb://localhost:27017/chattyapp-backend';

  constructor() {
    // Assign environment variables if they exist, otherwise use defaults
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.jWT_TOKEN = process.env.jWT_TOKEN || '1234'; // fallback JWT token
    this.NODE_ENV = process.env.NODE_ENV || '';       // environment mode (dev/prod/test)
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || ''; // encryption key
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || ''; // encryption key
    this.CLIENT_URL = process.env.CLIENT_URL || '';   // frontend application URL
    this.REDIS_HOST = process.env.REDIS_HOST || '';   // redis server host
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';  // cloud service name
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';  // cloud service API key
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';  // cloud service API secret
  }

  // Utility function to create a logger instance for structured logging
  // Bunyan allows filtering by log level (debug, info, error, etc.)
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  // Validate that no configuration property is undefined
  // This ensures critical configs (like DB URL, JWT, etc.) are set before starting the server
  public validatedConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value == undefined) {
        // If any property is undefined, throw an error and stop the application
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

// Export a single instance of Config (Singleton pattern)
// So the same configuration is shared across the whole application
export const config: Config = new Config();
