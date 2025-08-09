import express from 'express';
import next from 'next';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { parse } from 'url';

import type { Message } from './lib/types';
import {
  generateTagsAction,
  generateDescriptionAction,
  generateImageAction,
  supportChatAction,
  recommendGigsAction,
  translateTextAction,
} from './actions';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();

  const server = express();

  // Middleware for Express API
  server.use(express.json());
  server.use(
    cors({
      origin: [
        'https://freelancer-client-yytn.vercel.app',
        'http://localhost:3001',
      ],
      credentials: true,
    })
  );

  // Razorpay config
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
  });

  // API routes under /api
  const apiRouter = express.Router();

  apiRouter.post('/razorpay/order', async (req, res) => {
    try {
      const { amount, currency } = req.body;
      const options = {
        amount: amount * 100,
        currency: currency || 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error('Razorpay order creation error:', err);
      res.status(500).json({ error: 'Failed to create Razorpay order', details: err });
    }
  });

  apiRouter.post('/razorpay/verify', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const key_secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET';
      const hmac = crypto.createHmac('sha256', key_secret);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        res.json({ status: 'success' });
      } else {
        res.status(400).json({ status: 'failure', error: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Razorpay verification error:', error);
      res.status(500).json({ status: 'failure', error: 'Verification failed' });
    }
  });

  apiRouter.post('/generate-tags', async (req, res) => {
    try {
      const result = await generateTagsAction(req.body);
      res.json({ tags: result });
    } catch (error) {
      console.error('Generate tags error:', error);
      res.status(500).json({ error: 'Failed to generate tags' });
    }
  });

  apiRouter.post('/generate-description', async (req, res) => {
    try {
      const result = await generateDescriptionAction(req.body);
      res.json({ description: result });
    } catch (error) {
      console.error('Generate description error:', error);
      res.status(500).json({ error: 'Failed to generate description' });
    }
  });

  apiRouter.post('/generate-image', async (req, res) => {
    try {
      const result = await generateImageAction(req.body.title);
      res.json({ imageDataUri: result });
    } catch (error) {
      console.error('Generate image error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });

  apiRouter.post('/support-chat', async (req, res) => {
    try {
      const result = await supportChatAction(req.body);
      res.json({ response: result });
    } catch (error) {
      console.error('Support chat error:', error);
      res.status(500).json({ error: 'Support chat failed' });
    }
  });

  apiRouter.post('/recommend-gigs', async (req, res) => {
    try {
      const result = await recommendGigsAction(req.body);
      res.json({ recommendations: result });
    } catch (error) {
      console.error('Recommend gigs error:', error);
      res.status(500).json({ error: 'Failed to recommend gigs' });
    }
  });

  apiRouter.post('/translate-text', async (req, res) => {
    try {
      const result = await translateTextAction(req.body);
      res.json({ translation: result });
    } catch (error) {
      console.error('Translate text error:', error);
      res.status(500).json({ error: 'Translation failed' });
    }
  });

  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Mount apiRouter under /api path
  server.use('/api', apiRouter);

  // Handle Next.js requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Create HTTP server for socket.io
  const httpServer = createServer(server);

  // Setup socket.io on same server
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: [
        'https://freelancer-client-yytn.vercel.app',
        'http://localhost:3001',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on('sendMessage', (message: Message, conversationId: string) => {
      io.to(conversationId).emit('receiveMessage', message, conversationId);
      console.log(`Message sent to room ${conversationId}:`, message.text);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Server ready on http://${hostname}:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
