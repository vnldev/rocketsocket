import { server } from './http';
import './websocket/ChatService';

server.listen(process.env.APP_PORT, () =>
  console.log(`Servidor rodando na porta ${process.env.APP_PORT}`)
);
