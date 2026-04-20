import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision"; // Template rendering support
import Handlebars from "handlebars"; // view engine
import path from "path";
import { fileURLToPath } from "url";
import Cookie from "@hapi/cookie"; // cookie-based auth
import { webRoutes } from "./web-routes.js"; //web UI routes
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import dotenv from "dotenv"; // environment variables
import Joi from "joi"; // validation
import Inert from "@hapi/inert"; // static file sergving
import HapiSwagger from "hapi-swagger"; // API documentation
import { apiRoutes } from "./api-routes.js"; // API endpoints
import jwt from "hapi-auth-jwt2"; // JWT autehntication
import { validate } from "./api/jwt-utils.js"; // JWT validation logic
// Fix DNS resolution issues on Mango atlas
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Creates __filename and __dirname manually because ES modules don't provide them.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}
// process.exit(1);}

const swaggerOptions = {
  info: {
    title: "Placemark API",
    version: "0.1",
  },
};
async function init() {
  // Create Hapi server instance
  const server = Hapi.server({
    // Use env port or default to 3000
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  });

  await server.register(Vision); // View rendering
  await server.register(Cookie); //Cookie auth
  server.validator(Joi); //Enable Joi validation
  await server.register(Inert); //Static file handling
  // Register Swagger for API documentation
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  // Register JWT authentication plugin
  await server.register(jwt);
  // Configure Handlebars view engine
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false, //  // Disable caching during development
  });
  // JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  // Cookie-based session authentication strategy
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false, // Should be true in production
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  // Set default authentication method
  server.auth.default("session");
  // Initialize database (MongoDB)
  db.init("mongo");
  // Register all routes
  server.route(webRoutes);
  server.route(apiRoutes);

  // Start the server
  await server.start();
  console.log("Server running on %s", server.info.uri);
  process.stdin.resume();
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// Start the application
init();
