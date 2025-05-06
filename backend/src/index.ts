import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import globalRouter from "./routes/globalRouter";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
import { logger, loggerStream } from "./utils/logger";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;
const environment = process.env.NODE_ENV || "development";

// Security Middleware
app.use(helmet()); // various HTTP headers for security
app.use(cors()); // Configurable CORS for controlling origin access

// Logging Middleware (Conditional for development)
if (environment === "development") {
  app.use(morgan("dev")); // Concise output during development
} else {
  app.use(morgan("combined", { stream: loggerStream })); // More detailed logging for production
}

// Rate Limiting (Important for production to prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Body Parsing
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

// Performance Optimization
app.use(compression()); // Enables GZIP compression for response bodies
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks

app.use("/api/v1", globalRouter);

// Error Handling Middleware (Should be after routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Resource not found" });
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
});

app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack); // Keep console.error for immediate debugging of critical errors
  logger.error(`Unhandled error: ${err.message}`, err);
  res.status(500).json({ message: "Something went wrong" });
});

// Server startup
app.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
  logger.info(`Server started on port ${port} in ${environment} mode`);
});

// Global Error Handling for Unhandled Promises and Exceptions
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Consider more graceful shutdown in production
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  // Consider more robust error reporting and process management in production
  process.exit(1); // Terminate the process after logging the critical error
});
