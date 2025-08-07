"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var next_1 = require("next");
var socket_io_1 = require("socket.io");
var express = require("express");
var Razorpay = require("razorpay");
var cors = require("cors");
var crypto = require("crypto");
// Import the action functions from your server actions
var actions_1 = require("./actions");
var dev = process.env.NODE_ENV !== 'production';
var hostname = process.env.HOST || 'localhost';
var port = parseInt(process.env.PORT || '3000', 10);
var app = (0, next_1.default)({ dev: dev, hostname: hostname, port: port });
var handle = app.getRequestHandler();
// Express app for API routes
var appExpress = express();
// Middleware
appExpress.use(express.json());
appExpress.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow frontend origins
    credentials: true
}));
// Razorpay configuration
var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});
// Razorpay API routes
appExpress.post('/api/razorpay/order', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, currency, options, order, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, amount = _a.amount, currency = _a.currency;
                options = {
                    amount: amount * 100, // amount in smallest currency unit
                    currency: currency || 'INR',
                    receipt: "receipt_order_".concat(Date.now()),
                };
                return [4 /*yield*/, razorpay.orders.create(options)];
            case 1:
                order = _b.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error('Razorpay order creation error:', err_1);
                res.status(500).json({ error: 'Failed to create Razorpay order', details: err_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/razorpay/verify', function (req, res) {
    try {
        var _a = req.body, razorpay_order_id = _a.razorpay_order_id, razorpay_payment_id = _a.razorpay_payment_id, razorpay_signature = _a.razorpay_signature;
        var key_secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET';
        var hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        var generated_signature = hmac.digest('hex');
        if (generated_signature === razorpay_signature) {
            res.json({ status: 'success' });
        }
        else {
            res.status(400).json({ status: 'failure', error: 'Invalid signature' });
        }
    }
    catch (error) {
        console.error('Razorpay verification error:', error);
        res.status(500).json({ status: 'failure', error: 'Verification failed' });
    }
});
// AI Action API routes
appExpress.post('/api/generate-tags', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.generateTagsAction)(req.body)];
            case 1:
                result = _a.sent();
                res.json({ tags: result });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Generate tags error:', error_1);
                res.status(500).json({ error: 'Failed to generate tags' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/generate-description', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.generateDescriptionAction)(req.body)];
            case 1:
                result = _a.sent();
                res.json({ description: result });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Generate description error:', error_2);
                res.status(500).json({ error: 'Failed to generate description' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/generate-image', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.generateImageAction)(req.body.title)];
            case 1:
                result = _a.sent();
                res.json({ imageDataUri: result });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Generate image error:', error_3);
                res.status(500).json({ error: 'Failed to generate image' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/support-chat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.supportChatAction)(req.body)];
            case 1:
                result = _a.sent();
                res.json({ response: result });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Support chat error:', error_4);
                res.status(500).json({ error: 'Support chat failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/recommend-gigs', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.recommendGigsAction)(req.body)];
            case 1:
                result = _a.sent();
                res.json({ recommendations: result });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Recommend gigs error:', error_5);
                res.status(500).json({ error: 'Failed to recommend gigs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
appExpress.post('/api/translate-text', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.translateTextAction)(req.body)];
            case 1:
                result = _a.sent();
                res.json({ translation: result });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Translate text error:', error_6);
                res.status(500).json({ error: 'Translation failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Health check endpoint
appExpress.get('/api/health', function (req, res) {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Start Express API server on port 4000
appExpress.listen(4000, function () {
    console.log('Express API server running on http://localhost:5000');
});
// Next.js server setup
app.prepare().then(function () {
    var httpServer = (0, http_1.createServer)(function (req, res) {
        var parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    });
    // Socket.IO setup for real-time messaging
    var io = new socket_io_1.Server(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', function (socket) {
        console.log('A user connected:', socket.id);
        socket.on('joinConversation', function (conversationId) {
            socket.join(conversationId);
            console.log("Socket ".concat(socket.id, " joined room ").concat(conversationId));
        });
        socket.on('sendMessage', function (message, conversationId) {
            io.to(conversationId).emit('receiveMessage', message, conversationId);
            console.log("Message sent to room ".concat(conversationId, ":"), message.text);
        });
        socket.on('disconnect', function () {
            console.log('User disconnected:', socket.id);
        });
    });
    // Start Next.js server
    httpServer
        .listen(port, function () {
        console.log("> Next.js server ready on http://".concat(hostname, ":").concat(port));
    })
        .on('error', function (err) {
        console.error('Server error:', err);
        process.exit(1);
    });
});
// Graceful shutdown
process.on('SIGTERM', function () {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
