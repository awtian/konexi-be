const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Simple Social Media API for konexi.io test",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Awtian",
        url: "https://awtian.com",
        email: "me@awtian.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Localhost dev server",
      },
    ],
  },
  apis: ["./resources/*/*.router.js", "./resources/*/*.schemas.yaml"],
};

module.exports = swaggerJsdoc(options);
