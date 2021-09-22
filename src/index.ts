import express from 'express';
import http from 'http';
import { createTerminus } from '@godaddy/terminus';
import config from './config';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appId = `1.0.${Math.floor(Math.random() * 1000)}`;
let isAlive = true;

app.get('/', (req, res) => {
  res.send('Hello kubernetes!');
});

app.get('/app-id', (req, res) => {
  res.json({ appId });
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

app.get('/alive/toggle', (req, res) => {
  isAlive = false;
  console.log(`Alive is changed to ${isAlive}!`);
  res.json({ isAlive });
});

async function onSignal() {
  console.log('Server is starting cleanup!');
}

async function onShutdown () {
  console.log('Cleanup finished! Server is shutting down...');
}

async function onHealthCheck() {
  console.log(`Health check { isAlive: ${isAlive} } ...`);
  if (!isAlive) {
    console.log('Throwing error!');
    throw new Error('Server is not alive!');
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
