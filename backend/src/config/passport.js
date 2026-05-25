import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";
import { USER_STATUSES, ROLES } from "./constants.js";

if (process.env.GOOGLE_CLIENT_ID) {
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase() ?? null;
        const firstName = profile.name?.givenName  ?? profile.displayName ?? "Google";
        const lastName  = profile.name?.familyName ?? "User";

        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        // 1. Check if user already exists by email
        let user = await prisma.user.findFirst({
          where: { email },
          include: { company: true },
        });

        if (user) {
          // 2a. User exists — just return them
          // Block suspended/inactive users
          if (user.status === USER_STATUSES.SUSPENDED) {
            return done(new Error("ACCOUNT_SUSPENDED"), null);
          }
          if (user.status === USER_STATUSES.INACTIVE) {
            return done(new Error("ACCOUNT_INACTIVE"), null);
          }

          // Update lastLoginAt
          user = await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
            include: { company: true },
          });

          return done(null, user);
        }

        // 2b. New user — create them
        // Google users are pre-verified, no password needed
        // They register as COMPANY_ADMIN by default (they can set up their company after)
        const newUser = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            passwordHash: "GOOGLE_OAUTH_NO_PASSWORD", // placeholder
            role:       ROLES.COMPANY_ADMIN,
            isVerified: true,
            status:     USER_STATUSES.ACTIVE,
            companyId:  null, // no company yet — they complete setup after login
          },
          include: { company: true },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
}

export default passport;