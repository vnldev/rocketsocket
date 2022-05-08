import 'dotenv/config';
import 'reflect-metadata';
import { createServer } from 'http';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost/rocketsocket');

const server = createServer(app);

app.use(express.static(path.join(__dirname, '..', 'public')));

const io = new Server(server);

io.on('connection', (socket) => {});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello Websocket',
  });
});

export { server, io };
