import passport from "../../config/passport.js";
import { issueTokens, getDashboardPath, sanitizeUser } from "./auth.service.js";

// Step 1: Redirect user to Google
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// Step 2: Google redirects back here after user approves
export const googleCallback = [
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Issue tokens using your existing issueTokens function
      const tokens = await issueTokens(user, {
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      const sanitized = sanitizeUser(user);
      const redirectPath = getDashboardPath(user.role);

      // Send tokens to frontend via URL params
      // Frontend callback page will read these and store them
      const params = new URLSearchParams({
        accessToken:  tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role:         user.role.toLowerCase(),
        redirectTo:   redirectPath,
      });

      res.redirect(
        `${process.env.CLIENT_URL}/auth/google/callback?${params.toString()}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  },
];