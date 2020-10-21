let swaggerJsdoc = require("swagger-jsdoc");

const options = {    
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Delila Restó API with Swagger",
        version: "0.1.0",
        description:
          "This is a CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Luz Stella Soto",
          url: "https://acamica.com",
          email: "lssotog@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3010/",
        },
      ],
    },
    apis: ["./app.js"],
  };
  
  const specs = swaggerJsdoc(options);

  module.exports = specs;