import {
  LogLevels,
  TLog,
  TLogCollector,
  TLogFunction,
  TLogLevel,
} from "@/types/log";

export const createLogCollector = (): TLogCollector => {
  const logs: TLog[] = [];

  const logFunction = {} as Record<TLogLevel, TLogFunction>;
  for (const level of LogLevels) {
    logFunction[level] = (message: string) => {
      logs.push({ message, level, timestamp: new Date() });
    };
  }

  return {
    getAll: () => logs,
    ...logFunction,
  };
};
