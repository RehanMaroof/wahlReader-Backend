const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const logger = require("./logger");

const options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Wahl PDF Backend API",
            version: "1.0.0",
            description: "Wahl PDF Backend API Documentation in swagger",
        },
        components:{
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis:["src/routes/*.js"],
}

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    // Swagger page
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    
    // Documentation in JSON format
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    logger.info(`Version 1.0.0 docs available at http://localhost:${port}/api-docs`)
}

module.exports = swaggerDocs;