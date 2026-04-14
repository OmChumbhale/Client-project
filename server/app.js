import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import apiRouter from './routes/api.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();

const app = express();
let initializationPromise = null;

function buildMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const databaseName = process.env.MONGODB_DB_NAME || 'stepwise';

  if (!username || !password || !cluster) {
    return '';
  }

  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);
  return `mongodb+srv://${encodedUsername}:${encodedPassword}@${cluster}/${databaseName}?retryWrites=true&w=majority&appName=ArchanaTradersNashik`;
}

export async function ensureDataReady() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const mongoUri = buildMongoUri();

    if (!mongoUri) {
      process.env.DATA_MODE = 'memory';
      console.error('MONGODB_URI is missing. Starting API in memory mode using local sample data.');
      return;
    }

    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 8000,
        });
      }
    } catch (error) {
      process.env.DATA_MODE = 'memory';
      console.error(`MongoDB connection failed: ${error.message}`);
      console.error('Starting API in memory mode using local sample data.');
      return;
    }

    process.env.DATA_MODE = 'database';

    try {
      await seedDatabase();
    } catch (error) {
      console.error(`Database seed skipped: ${error.message}`);
    }
  })();

  return initializationPromise;
}

app.use(cors());
app.use(express.json());

app.use(async (_request, _response, next) => {
  try {
    await ensureDataReady();
    next();
  } catch (error) {
    next(error);
  }
});

function sendHealthResponse(_request, response) {
  response.json({
    ok: true,
    dataMode: process.env.DATA_MODE || 'database',
    mongoConnected: mongoose.connection.readyState === 1,
  });
}

app.get('/health', sendHealthResponse);
app.get('/api/health', sendHealthResponse);

app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use((error, _request, response, _next) => {
  response.status(500).json({
    message: error.message || 'Unexpected server error',
  });
});

export default app;
