import os from "os";
import configs from "../configs/configs";

interface SystemHealth {
  cpuUsage: number[];
  cpuDetails: { model: string; speed: number }[];
  totalMemory: string;
  freeMemory: string;
  platform: string;
  osVersion: string;
  uptime: string;
}

interface MemoryUsage {
  heapTotal: string;
  heapUsed: string;
  rss: string;
  external: string;
}

interface ApplicationHealth {
  environment: string;
  uptime: string;
  memoryUsage: MemoryUsage;
  nodeVersion: string;
  processId: number;
  config: Record<string, any>; // Include relevant configurations
}

export const getSystemHealth = (): SystemHealth => {
  const totalMemoryMB = (os.totalmem() / (1024 * 1024)).toFixed(2);
  const freeMemoryMB = (os.freemem() / (1024 * 1024)).toFixed(2);
  const cpus = os.cpus();
  const cpuDetails = cpus.map((cpu) => ({
    model: cpu.model,
    speed: cpu.speed,
  }));
  return {
    cpuUsage: os.loadavg(),
    cpuDetails,
    totalMemory: `${totalMemoryMB} MB`,
    freeMemory: `${freeMemoryMB} MB`,
    platform: os.platform(),
    osVersion: os.version(),
    uptime: `${os.uptime().toFixed(2)} Seconds`,
  };
};

export const getApplicationHealth = (): ApplicationHealth => {
  const memoryUsageRaw = process.memoryUsage();
  const heapTotalMB = (memoryUsageRaw.heapTotal / (1024 * 1024)).toFixed(2);
  const heapUsedMB = (memoryUsageRaw.heapUsed / (1024 * 1024)).toFixed(2);
  const rssMB = (memoryUsageRaw.rss / (1024 * 1024)).toFixed(2);
  const externalMB = (memoryUsageRaw.external / (1024 * 1024)).toFixed(2);

  return {
    environment: configs.ENV!,
    uptime: `${process.uptime().toFixed(2)} Seconds`, // More conventional capitalization
    memoryUsage: {
      heapTotal: `${heapTotalMB} MB`,
      heapUsed: `${heapUsedMB} MB`,
      rss: `${rssMB} MB`, // Resident Set Size - total memory allocated for the process
      external: `${externalMB} MB`, // Memory used by C++ objects bound to JS objects
    },
    nodeVersion: process.version,
    processId: process.pid,
    config: {
      // Include specific configurations you want to expose (be cautious with sensitive info)
      environment: configs.ENV,
      port: configs.PORT,
      // Add other relevant non-sensitive configurations
    },
  };
};
