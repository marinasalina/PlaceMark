import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import Cookie from "@hapi/cookie";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import dotenv from "dotenv";
import Joi from "joi";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import { apiRoutes } from "./api-routes.js";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const server = Hapi.server({
    // Render assign a random port and still works locally
    port: process.env.PORT || 3000,
  });

  await server.register(Vision);
  await server.register(Cookie);
  server.validator(Joi);
  await server.register(Inert);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  await server.register(jwt);
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

  server.auth.default("session");

  db.init("mongo");
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
