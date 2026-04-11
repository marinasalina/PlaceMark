// Import all controllers used to handle web page requests
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { adminDashboardController } from "./controllers/admin-dashboard-controller.js";
import { reviewController } from "./controllers/review-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  {
    method: "GET",
    path: "/dashboard/deleteplacemark/{id}",
    config: dashboardController.deletePlacemark,
  },
  {
    method: "POST",
    path: "/dashboard/addplacemark",
    config: dashboardController.addPlacemark,
  },

  { method: "GET", path: "/placemark/{id}", config: placemarkController.index },
  {
    method: "POST",
    path: "/placemark/{id}/edit",
    config: placemarkController.editPlacemark,
  },
  { method: "GET", path: "/category", config: categoryController.index },
  {
    method: "GET",
    path: "/admin",
    config: adminDashboardController.index,
  },
  {
    method: "GET",
    path: "/admin/users/delete/{id}",
    config: adminDashboardController.deleteUser,
  },

  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/placemark/{id}/addreview",
    config: reviewController.addReview,
  },
  {
    method: "POST",
    path: "/api/placemarks/{id}/reviews",
    handler: reviewApi.addReview,
  },
  {
    method: "GET",
    path: "/api/placemarks/{id}/reviews",
    handler: reviewApi.getReviews,
  },
  {
    method: "DELETE",
    path: "/api/reviews",
    handler: reviewApi.deleteAllReviews,
  },
];
