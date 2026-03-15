import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
// Controller for handling user accounts: signup, login, logout, and session validation
export const accountsController = {
  // Show the main landing page
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to PlaceMark" });
    },
  },
  // Display the signup form
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for PlaceMark" });
    },
  },
  // Handle user signup with validation
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("signup-view", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  // Display the login form
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to PlaceMark" });
    },
  },
  // Handle user login and set session cookie
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("login-view", { title: "Log in error", errors: error.details })
          .takeover()
          .code(400);
      },
    },

    handler: async function (request, h) {
      request.cookieAuth.clear();
      const { email, password } = request.payload;
      // Look up user by email
      let user;
      user = await db.userStore.getUserByEmail(email);
      // Invalid login
      if (!user || user.password !== password) {
        return h.redirect("/");
      }

      // Check if user is admin
      if (
        email === process.env.EMAIL_ADMIN &&
        password === process.env.password
      ) {
        user = await db.userStore.updateUser(user._id, { isAdmin: true });
      }
      // Store user ID in session cookie
      request.cookieAuth.set({ id: user._id });

      // Redirect admins to admin dashboard
      if (user.isAdmin) {
        // Redirect based on role
        return h.redirect("/admin");
      }

      return h.redirect("/dashboard");
    },
  },
  // Log the user out and clear session
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  // Validate session cookie and return user credentials
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
