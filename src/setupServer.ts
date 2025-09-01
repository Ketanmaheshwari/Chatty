// Core imports from Express and Node.js HTTP
import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';

// Security and middleware libraries
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookiesession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors'; // Enables handling async/await errors without try-catch in routes

// Socket.IO + Redis setup
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

// Logger
import Logger from 'bunyan';
import compression from 'compression';

// Internal project imports
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';

// Define a constant port number for the server
const SERVER_PORT = 5000;

// Create a dedicated logger for server logs
const log: Logger = config.createLogger('server');

// ChattyServer class that encapsulates everything needed to start the app
export class ChattyServer {
  private app: Application; // Express application instance

  constructor(app: Application) {
    this.app = app;
  }

  // Main entrypoint for starting the server
  public start(): void {
    this.securityMiddleware(this.app);      // Apply security middleware
    this.standardMiddleware(this.app);      // Apply common middlewares
    this.routesMiddleware(this.app);        // Register routes
    this.globalErrorHandler(this.app);      // Centralized error handling
    this.startServer(this.app);             // Start HTTP + WebSocket server
  }

  // =======================
  // 🔒 Security Middleware
  // =======================
  private securityMiddleware(app: Application): void {
    // Cookie session middleware → used for storing session data in cookies
    app.use(
      cookiesession({
        name: 'session', // Cookie name
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!], // Encryption keys
        maxAge: 24 * 7 * 3600000, // Expiry: 7 days
        secure: config.NODE_ENV !== 'development' // Secure cookies only in non-dev environments
      })
    );

    app.use(hpp());     // Protects against HTTP parameter pollution
    app.use(helmet());  // Adds security headers
    app.use(
      cors({
        origin: config.CLIENT_URL, // Only allow requests from frontend URL
        credentials: true,         // Allow cookies/auth headers
        optionsSuccessStatus: 200, // Success status for older browsers
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allowed HTTP methods
      })
    );
  }

  // =======================
  // ⚙️ Standard Middleware
  // =======================
  private standardMiddleware(app: Application): void {
    app.use(compression());                        // Compress responses for better performance
    app.use(json({ limit: '50mb' }));              // Parse JSON bodies (limit 50MB for large payloads)
    app.use(urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded data
  }

  // =======================
  // 🚏 Routes
  // =======================
  private routesMiddleware(app: Application): void {
    applicationRoutes(app); // Register all app routes from routes.ts
  }

  // =======================
  // ❌ Global Error Handling
  // =======================
  private globalErrorHandler(app: Application): void {
    // Catch-all for unmatched routes
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    // Centralized error middleware
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error); // Log error
      if (error instanceof CustomError) {
        // If it's a known custom error → send formatted error response
        return res.status(error.statusCode).json(error.seralizeErrors());
      }
      next(); // Pass to next middleware if not handled
    });
  }

  // =======================
  // 🚀 Start HTTP + Socket.IO Server
  // =======================
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);       // Create HTTP server
      const socketIo: Server = await this.createSocketIO(httpServer); // Attach Socket.IO with Redis adapter
      this.startHttpServer(httpServer);                           // Start listening on port
      this.socketIOConnections(socketIo);                         // Manage Socket.IO connections
    } catch (error) {
      log.error(error);
    }
  }

  // =======================
  // 🔌 Socket.IO + Redis Pub/Sub
  // =======================
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL, // Allow frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    // Create Redis pub/sub clients for scaling Socket.IO across instances
    const pubClient = createClient({ url: config.REDIS_HOST }); // Publisher
    const subClient = pubClient.duplicate();                   // Subscriber

    // Connect both clients in parallel
    await Promise.all([pubClient.connect(), subClient.connect()]);

    // Attach Redis adapter to Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Connected to redis successfully');

    return io;
  }

  // =======================
  // 📡 Start HTTP Server
  // =======================
  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  }

  // =======================
  // 🔄 Manage Socket.IO Connections
  // =======================
  private socketIOConnections(io: Server): void {
    log.info('SocketIO Connections');
    // ⚡ Future: Define all real-time event handlers here
    // Example: io.on('connection', (socket) => { ... });
  }
}
