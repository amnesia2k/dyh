const COLORS = {
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  fatal: "\x1b[41m", // red background
};

const RESET = "\x1b[0m";

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `${COLORS[level]}[${level.toUpperCase()}] ${timestamp}:${RESET} ${message}`;
}

export const logger = (() => {
  const log = (level, message, ...optionalParams) => {
    const prefix = formatMessage(level, "");

    if (typeof message === "object") {
      // Log prefix + object separately so Node pretty-prints it
      console[level === "warn" ? "warn" : level](
        prefix,
        message,
        ...optionalParams
      );
    } else {
      console[level === "warn" ? "warn" : level](
        prefix,
        message,
        ...optionalParams
      );
    }

    if (level === "fatal") process.exit(1);
  };

  return {
    info: (msg, ...rest) => log("info", msg, ...rest),
    warn: (msg, ...rest) => log("warn", msg, ...rest),
    error: (msg, ...rest) => log("error", msg, ...rest),
    fatal: (msg, ...rest) => log("fatal", msg, ...rest),
  };
})();
