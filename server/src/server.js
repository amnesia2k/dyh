import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.js";
import { connectToDB } from "./db/mongo.js";
import morgan from "morgan";
import routes from "./routes/index.route.js";
import { env } from "./utils/env.js";
import { startKeepAliveJob } from "./utils/keep-alive.cron.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js";
import { isCustomError, response } from "./utils/response.js";

const app = express();

const PORT = env.PORT || 8000;

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

connectToDB();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root endpoint (not used directly)
 *     description: Simple root endpoint; the main API is mounted at `/api/v1`.
 *     responses:
 *       200:
 *         description: Root OK.
 */
app.get("/api/v1", (req, res) => {
  response(res, 200, "Hello World!");
});

app.use("/api/v1", routes);

// Swagger API docs UI.
// After starting the server, open http://localhost:<PORT>/api-docs in the browser
// to explore and test all documented endpoints.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error middleware
app.use((err, _req, res, _next) => {
  logger.error(err);

  if (isCustomError(err)) {
    return response(res, err.statusCode, err.message, undefined, {
      error: err.details ?? err.message,
    });
  }

  return response(res, 500, "Internal Server Error", undefined, {
    error: err.message,
  });
});

// not found middleware
app.use((_req, res) => {
  return response(res, 404, "Not Found");
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server is running on port ${PORT}`);

  // Start the keep-alive cron job (only runs in production).
  startKeepAliveJob();
});
