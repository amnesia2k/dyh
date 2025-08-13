const COLORS = {
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  fatal: "\x1b[41m", // red background
};

const RESET = "\x1b[0m";

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `${COLORS[level]}[${level.toUpperCase()}] ${timestamp}: ${message}${RESET}`;
}

export const logger = (() => {
  const log = (level, message) => {
    const formatted = formatMessage(level, message);

    switch (level) {
      case "info":
        console.log(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
      case "fatal":
        console.error(formatted);
        if (level === "fatal") process.exit(1);
        break;
    }
  };

  return {
    info: (msg) => log("info", msg),
    warn: (msg) => log("warn", msg),
    error: (msg) => log("error", msg),
    fatal: (msg) => log("fatal", msg),
  };
})();
