import express from 'express';
import http from 'http';
import path from 'path';
import { createTerminus } from '@godaddy/terminus';
import config from './config';
import cors from './cors';
import names from './names';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

const name = names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 100);
let isHealthy = true;

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public/', 'index.html'))
});

app.get('/ping', (req, res) => {
  res.json({
    name,
    isHealthy,
  });
});

app.get('/env', (req, res) => {
  res.json(config);
});

app.get('/env/:name', (req, res) => {
  res.json({
    name: req.params.name,
    value: config[req.params.name],
  });
});

app.get('/health/toggle', (req, res) => {
  isHealthy = false;
  console.log(`isHealthy is changed to ${isHealthy}!`);
  res.json({ isHealthy });
});

async function onSignal() {
  console.log('Server is starting cleanup!');
}

async function onShutdown () {
  console.log('Cleanup finished! Server is shutting down...');
}

async function onHealthCheck() {
  console.log(`Health check { isHealthy: ${isHealthy} } ...`);

  if (!isHealthy) {
    console.error('Server is not healthy!');

    throw new Error('Server is not healthy!');
  }
}

createTerminus(server, {
  healthChecks: {
    '/health/liveness': onHealthCheck,
  },
  onSignal,
  onShutdown,
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

server.listen(3001);
