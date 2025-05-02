import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { getApplicationHealth, getSystemHealth } from "../utils/resources";

const environment = process.env.NODE_ENV;

/**
 * Self-check endpoint - Checks the basic functionality of the API.
 */
export const self = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    return res
      .status(200)
      .json({ message: "Backend is healthy!", success: true });
  } catch (error: any) {
    logger.error(`Self route error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: environment === "development" ? error.message : undefined,
    });
  }
};

/**
 * Health check endpoint - Provides details about the application and system health.
 */
export const health = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const [applicationHealth, systemHealth] = await Promise.all([
      getApplicationHealth(),
      getSystemHealth(),
    ]);
    return res.status(200).json({
      message: "Health check passed!",
      application: applicationHealth,
      system: systemHealth,
    });
  } catch (error: any) {
    logger.error(`Health check error: ${error.message}`, error);
    return res.status(503).json({
      success: false,
      message: "Health check failed. Some services are unavailable.",
      error: environment === "development" ? error.message : undefined,
    });
  }
};
