/**
 * Shared HTTP response helper and custom error utilities.
 */

/**
 * Send a standardized JSON response.
 *
 * Usage:
 *  response(res, 200, "OK", result);
 *  response(res, 200, "OK", items, { count: items.length });
 *  response(res, 400, "Bad Request", undefined, { error: "Invalid input" });
 *
 * - `success` is derived from the status code (2xx/3xx => true, others => false).
 * - The 4th argument is always returned as `data`.
 * - Optional `extra` (5th arg) is shallow-merged into the top-level payload.
 */
export function response(res, statusCode, message, data, extra) {
  const isSuccess = statusCode >= 200 && statusCode < 400;

  const payload = {
    success: isSuccess,
    message,
  };

  if (extra && typeof extra === "object" && !Array.isArray(extra)) {
    Object.assign(payload, extra);
  }

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Custom error class for consistent error handling.
 */
export class CustomError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Helper to create a CustomError instance.
 */
export function customError(statusCode, message, details) {
  return new CustomError(statusCode, message, details);
}

export function isCustomError(error) {
  return (
    error instanceof CustomError ||
    (typeof error?.statusCode === "number" && typeof error?.message === "string")
  );
}
