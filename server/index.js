import app, { ensureDataReady } from './app.js';
const port = Number(process.env.PORT || 5000);

async function startServer() {
  await ensureDataReady();

  app.listen(port, () => {
    console.log(`Archana Traders Nashik API running on http://localhost:${port}`);
  });
}

startServer();
