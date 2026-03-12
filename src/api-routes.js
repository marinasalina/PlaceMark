import { userApi } from "./api/user-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAllUsers },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/playlists", config: placemarkApi.create },
  { method: "DELETE", path: "/api/playlists", config: placemarktApi.deleteAll },
  { method: "GET", path: "/api/playlists", config: placemarktApi.find },
  { method: "GET", path: "/api/playlists/{id}", config: placemark.findOne },
  {
    method: "DELETE",
    path: "/api/playlists/{id}",
    config: placemarkApi.deleteOne,
  },
];
