import swaggerJsdoc from "swagger-jsdoc";
import { swaggerSchemas } from "./swagger.schemas.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ConWise API",
      version: "1.0.0",
      description: "Construction Management System API",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development Server",
      },
    ],
    components: {
      schemas: swaggerSchemas,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token **without** the 'Bearer ' prefix",
        },
      },
    },
    // ← Add this global security (helps a lot)
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Authentication", description: "Auth related endpoints" },
      { name: "User Management", description: "User and role management" },
    ],
  },
  apis: ["./src/modules/**/*.routes.js", "./src/docs/swagger.schemas.js"],
};

const specs = swaggerJsdoc(options);
export { specs };
