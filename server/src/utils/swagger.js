import swaggerJsdoc from "swagger-jsdoc";

// Basic Swagger/OpenAPI definition for the DYH API.
// This is the root metadata that appears at the top of the Swagger UI.
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DYH API",
    version: "1.0.0",
    description:
      "API documentation for the DYH backend (members, sermons, events, announcements, prayer requests, testimonies, activities, etc.)",
  },
  servers: [
    {
      // The API in this project is mounted under `/api/v1` in server/src/server.js
      // e.g. app.use(\"/api/v1\", routes);
      url: "/api/v1",
      description: "DYH API v1",
    },
  ],
  components: {
    securitySchemes: {
      // Cookie-based auth used by HOT/admin routes
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
    schemas: {
      // Update payloads are generally "partial" versions of the create payloads.
      MemberUpdate: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          birthday: { type: "string", format: "date" },
          address: { type: "string" },
          departmentOfInterest: { type: "string" },
          joinedAt: { type: "string", format: "date" },
          photo: { type: "string", description: "URL to member photo" },
        },
      },
      SermonUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: { type: "string", format: "date" },
          spotifyEmbedUrl: { type: "string" },
          description: { type: "string" },
          speaker: { type: "string" },
        },
      },
      EventUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: { type: "string", format: "date" },
          location: { type: "string" },
          description: { type: "string" },
          featured: { type: "boolean" },
        },
      },
      AnnouncementUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: { type: "string", format: "date" },
          summary: { type: "string" },
          body: { type: "string" },
        },
      },
      PrayerRequestUpdate: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          message: { type: "string" },
          anonymous: { type: "boolean" },
          status: {
            type: "string",
            enum: ["new", "read", "resolved"],
          },
        },
      },
      HotUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          tribe: { type: "string" },
          bio: { type: "string" },
          photo: { type: "string" },
          phone: { type: "string" },
          role: { type: "string", description: "Role of the HOT (e.g., admin)" },
        },
      },
      TestimonyUpdate: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["new", "read", "resolved"],
          },
          featured: { type: "boolean" },
          approved: { type: "boolean" },
          approvedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

// swaggerJsdoc will scan the files listed in `apis` for JSDoc comments
// starting with `@openapi` and build an OpenAPI spec object from them.
const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/server.js", // root /api/v1 health check
    "./src/routes/*.js", // all route files (member, sermon, event, etc.)
  ],
};

// Generated OpenAPI specification used by Swagger UI.
export const swaggerSpec = swaggerJsdoc(options);
