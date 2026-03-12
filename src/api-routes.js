import { userApi } from "./api/user-api.js";
import { placemarkApi } from "./api/placemark-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAllUsers },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/placemarklists", config: placemarkApi.create },
  {
    method: "DELETE",
    path: "/api/placemarklists",
    config: placemarkApi.deleteAll,
  },
  { method: "GET", path: "/api/placemarklists", config: placemarkApi.find },
  {
    method: "GET",
    path: "/api/placemarklists/{id}",
    config: placemarkApi.findOne,
  },
  {
    method: "DELETE",
    path: "/api/placemarklists/{id}",
    config: placemarkApi.deleteOne,
  },
];
