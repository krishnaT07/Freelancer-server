import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';

import type { Message } from './lib/types';
import {
  generateTagsAction,
  generateDescriptionAction,
  generateImageAction,
  supportChatAction,
  recommendGigsAction,
  translateTextAction,
} from './actions';

const port = parseInt(process.env.PORT || '3000', 10);

async function main() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: [
        'https://freelancer-client-yytn.vercel.app',
        'http://localhost:3001',
      ],
      credentials: true,
    })
  );

  // Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
  });

  // API routes
  app.post('/api/razorpay/order', async (req, res) => {
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

  app.post('/api/razorpay/verify', (req, res) => {
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

  app.post('/api/generate-tags', async (req, res) => {
    try {
      const result = await generateTagsAction(req.body);
      res.json({ tags: result });
    } catch (error) {
      console.error('Generate tags error:', error);
      res.status(500).json({ error: 'Failed to generate tags' });
    }
  });

  app.post('/api/generate-description', async (req, res) => {
    try {
      const result = await generateDescriptionAction(req.body);
      res.json({ description: result });
    } catch (error) {
      console.error('Generate description error:', error);
      res.status(500).json({ error: 'Failed to generate description' });
    }
  });

  app.post('/api/generate-image', async (req, res) => {
    try {
      const result = await generateImageAction(req.body.title);
      res.json({ imageDataUri: result });
    } catch (error) {
      console.error('Generate image error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });

  app.post('/api/support-chat', async (req, res) => {
    try {
      const result = await supportChatAction(req.body);
      res.json({ response: result });
    } catch (error) {
      console.error('Support chat error:', error);
      res.status(500).json({ error: 'Support chat failed' });
    }
  });

  app.post('/api/recommend-gigs', async (req, res) => {
    try {
      const result = await recommendGigsAction(req.body);
      res.json({ recommendations: result });
    } catch (error) {
      console.error('Recommend gigs error:', error);
      res.status(500).json({ error: 'Failed to recommend gigs' });
    }
  });

  app.post('/api/translate-text', async (req, res) => {
    try {
      const result = await translateTextAction(req.body);
      res.json({ translation: result });
    } catch (error) {
      console.error('Translate text error:', error);
      res.status(500).json({ error: 'Translation failed' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Create HTTP server (for socket.io)
  const httpServer = createServer(app);

  // Setup Socket.io server
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
    console.log('User connected:', socket.id);

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

  // Start server
  httpServer.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});

