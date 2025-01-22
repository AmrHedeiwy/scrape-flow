export const LogLevels = ["info", "error"] as const;
export type TLogLevel = (typeof LogLevels)[number];

export type TLogFunction = (message: string) => void;
export type TLog = {
  message: string;
  level: TLogLevel;
  timestamp: Date;
};

export type TLogCollector = {
  getAll: () => TLog[];
} & {
  [K in TLogLevel]: TLogFunction;
};
