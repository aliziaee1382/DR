import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface ClientConnection {
  ws: WebSocket;
  appointmentId?: string;
  userId?: string;
  userName?: string;
  role?: string;
}

interface ChatMessageData {
  id: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'system';
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
}

// In-memory store for room chat messages
const roomChatStore: Record<string, ChatMessageData[]> = {
  'apt-1': [
    {
      id: 'm1',
      appointmentId: 'apt-1',
      senderId: 'doc-1',
      senderName: 'دکتر مریم رضایی',
      senderRole: 'doctor',
      text: 'سلام علی عزیز، وقتتون بخیر. گزارش جواب آزمایش و علائم فعلی خودتون رو برام بفرستید.',
      timestamp: '۱۰:۳۰'
    },
    {
      id: 'm2',
      appointmentId: 'apt-1',
      senderId: 'usr-patient',
      senderName: 'علی ضیائی',
      senderRole: 'patient',
      text: 'سلام خانم دکتر. تصویر جدیدترین جواب آزمایش خون رو براتون ارسال می‌کنم.',
      timestamp: '۱۰:۳۲'
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get chat history API fallback
  app.get('/api/chat/:appointmentId', (req, res) => {
    const { appointmentId } = req.params;
    res.json(roomChatStore[appointmentId] || []);
  });

  const server = http.createServer(app);

  // WebSocket Server setup attached to HTTP server
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = new Set<ClientConnection>();

  wss.on('connection', (ws: WebSocket) => {
    const client: ClientConnection = { ws };
    clients.add(client);

    ws.on('message', (rawMessage: string) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        switch (data.type) {
          case 'join_room': {
            client.appointmentId = data.appointmentId;
            client.userId = data.userId;
            client.userName = data.userName;
            client.role = data.role;

            // Initialize chat history for room if empty
            if (!roomChatStore[data.appointmentId]) {
              roomChatStore[data.appointmentId] = [];
            }

            // Send existing chat history to joining client
            ws.send(
              JSON.stringify({
                type: 'chat_history',
                appointmentId: data.appointmentId,
                messages: roomChatStore[data.appointmentId]
              })
            );

            // Notify others in room that a user joined
            broadcastToRoom(data.appointmentId, {
              type: 'user_joined',
              appointmentId: data.appointmentId,
              userId: data.userId,
              userName: data.userName,
              role: data.role
            }, ws);
            break;
          }

          case 'send_message': {
            const { appointmentId, message } = data;
            if (!appointmentId || !message) return;

            if (!roomChatStore[appointmentId]) {
              roomChatStore[appointmentId] = [];
            }

            // Prevent duplicate message IDs
            if (!roomChatStore[appointmentId].some((m) => m.id === message.id)) {
              roomChatStore[appointmentId].push(message);
            }

            // Broadcast message to everyone in the room (including sender for acknowledgment or sync)
            broadcastToRoom(appointmentId, {
              type: 'new_message',
              appointmentId,
              message
            });
            break;
          }

          // WebRTC Signaling events
          case 'webrtc_start_call':
          case 'webrtc_offer':
          case 'webrtc_answer':
          case 'webrtc_ice_candidate':
          case 'webrtc_end_call':
          case 'webrtc_media_state': {
            const { appointmentId } = data;
            if (appointmentId) {
              // Forward signaling message to other peer(s) in room
              broadcastToRoom(appointmentId, data, ws);
            }
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(client);
      if (client.appointmentId) {
        broadcastToRoom(client.appointmentId, {
          type: 'user_left',
          appointmentId: client.appointmentId,
          userId: client.userId,
          role: client.role
        });
      }
    });
  });

  function broadcastToRoom(appointmentId: string, payload: any, excludeWs?: WebSocket) {
    const jsonStr = JSON.stringify(payload);
    clients.forEach((client) => {
      if (
        client.appointmentId === appointmentId &&
        client.ws.readyState === WebSocket.OPEN &&
        client.ws !== excludeWs
      ) {
        client.ws.send(jsonStr);
      }
    });
  }

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
