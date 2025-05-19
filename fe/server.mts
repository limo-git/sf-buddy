import { parse } from 'node:url';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import next from 'next';
import { WebSocket, WebSocketServer } from 'ws';
import { Socket } from 'node:net';

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();
const clients: Set<WebSocket> = new Set();

nextApp.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res, parse(req.url || '', true));
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: WebSocket) => {
    (ws as any).isAlive = true;

    ws.on('pong', () => {
      (ws as any).isAlive = true;
    });

    clients.add(ws);
    console.log('New client connected');

    ws.on('message', (message: Buffer) => {
      console.log(`Message received: ${message}`);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && (message.toString() !== '{"event":"ping"}')) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected');
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });

  // Heartbeat ping interval
  setInterval(() => {
    wss.clients.forEach(ws => {
      if ((ws as any).isAlive === false) {
        console.log('Terminating dead client');
        return ws.terminate();
      }
      (ws as any).isAlive = false;
      ws.ping();
    });
  }, 30000);

  server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const { pathname } = parse(req.url || "/", true);
    console.log('Upgrade request for:', pathname);

    if (pathname === "/_next/webpack-hmr") {
      nextApp.getUpgradeHandler()(req, socket, head);
      return;
    }

    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
      return;
    }

    console.log('Destroying socket for unknown pathname:', pathname);
    socket.destroy();
  });

  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
});
