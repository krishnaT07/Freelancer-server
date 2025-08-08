// declaration.d.ts

// Razorpay minimal typing
declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    // Add other methods here as needed
  }

  export = Razorpay;
}

// genkit (if you don't have types)
declare module 'genkit' {
  export const ai: any;
  export function defineFlow(config: any, fn: any): any;
}

// @genkit-ai/googleai (if no types)
declare module '@genkit-ai/googleai' {
  export const GoogleAI: any;
}

// firebase minimal typings for your imports if needed
declare module 'firebase/app' {
  export const initializeApp: any;
}

declare module 'firebase/auth' {
  export const getAuth: any;
}

declare module 'firebase/storage' {
  export const getStorage: any;
}

// zod (if needed, but it has types normally)
declare module 'zod' {
  export * from 'zod';
}

// socket.io (you installed @types/socket.io, but if any error)
declare module 'socket.io' {
  import * as http from 'http';
  export function Server(server: http.Server, opts?: any): any;
}

// express (you installed @types/express, but if any error)
declare module 'express' {
  import * as http from 'http';
  import * as events from 'events';
  const express: any;
  export = express;
}

// cors (you installed @types/cors, but if any error)
declare module 'cors' {
  const cors: any;
  export = cors;
}

// For Node built-ins like 'http', 'url', 'crypto', you have @types/node installed.
// But if you still get errors, make sure tsconfig includes:
// "types": ["node"]
