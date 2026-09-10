// Vercel serverless entry point.
// dotenv.config() is harmless here (used for local `vercel dev` testing) —
// in an actual Vercel deployment, env vars come from the dashboard instead,
// not from this .env file (which isn't uploaded).
require('dotenv').config();
const app = require('../src/app');

module.exports = app;