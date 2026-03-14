import { db } from "../models/db.js";

export const adminDashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser || !loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }

      const users = await db.userStore.getAllUsers();

      return h.view("admin-dashboard-view", {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
      });
    },
  },
  deleteUser: {
    handler: async function (request, h) {
      const userId = request.params.id;
      await db.userStore.deleteUserById(userId);
      return h.redirect("/admin");
    },
  },
};
