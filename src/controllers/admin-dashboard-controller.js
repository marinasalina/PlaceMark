import { db } from "../models/db.js";
// Controller for admin dashboard actions
export const adminDashboardController = {
  // Show the admin dashboard (only accessible to admin users)
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // Redirect non-admin users to their normal dashboard
      if (!loggedInUser || !loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }
      // Load all users for admin management
      const users = await db.userStore.getAllUsers();

      return h.view("admin-dashboard-view", {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
      });
    },
  },
  // Delete a specific user by ID
  deleteUser: {
    handler: async function (request, h) {
      const userId = request.params.id;
      await db.userStore.deleteUserById(userId);
      return h.redirect("/admin");
    },
  },
};
