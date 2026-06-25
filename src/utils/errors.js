export const ERROR_CODES = {
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  CONFLICT: "CONFLICT",
  SERVER: "SERVER_ERROR",
};

export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err.message && err.message.includes("UNIQUE")) {
    return res.status(409).json({
      error: "Username already taken.",
      code: ERROR_CODES.CONFLICT,
    });
  }

  res.status(500).json({
    error: "Internal server error.",
    code: ERROR_CODES.SERVER,
  });
}