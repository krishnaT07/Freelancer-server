"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.app = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var storage_1 = require("firebase/storage");
var firebaseConfig = {
    "projectId": "freelance-marketplace-a0f6b",
    "appId": "1:286902035447:web:8d7e7ff002f25fd099c4f2",
    "storageBucket": "freelance-marketplace-a0f6b.firebasestorage.app",
    "apiKey": "AIzaSyA-NOSAYDBkpwi4bwM50I6VgPj5hiP8bSQ",
    "authDomain": "freelance-marketplace-a0f6b.firebaseapp.com",
    "messagingSenderId": "286902035447"
};
var app = !(0, app_1.getApps)().length ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
exports.app = app;
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
