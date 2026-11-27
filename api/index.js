/**
 * Vercel Serverless Function Entry Point
 * 
 * This file wraps the Express.js backend as a Vercel serverless function.
 * All /api/* requests are routed here by vercel.json rewrites.
 */
import { connectDB } from '../backend/config/db.js';
import app from '../backend/server.js';

// Ensure MongoDB is connected before handling requests
let isDBReady = false;

const handler = async (req, res) => {
  if (!isDBReady) {
    await connectDB();
    isDBReady = true;
  }
  return app(req, res);
};

export default handler;
