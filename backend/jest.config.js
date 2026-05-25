// jest.config.js  — place at backend/jest.config.js
//
// Your backend uses ESM (import/export). Jest needs the
// --experimental-vm-modules flag to support it natively.
// See the "test" script in package.json below.

export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  maxWorkers: 1, // serial — prevents DB write collisions between suites
  testTimeout: 60000, // 60 s — slow Neon cold-start queries can take 5-9s each
  verbose: true,
  forceExit: true, // exit cleanly even if Prisma connection stays open
  transform: {}, // do NOT transform — Node handles ESM natively
};
