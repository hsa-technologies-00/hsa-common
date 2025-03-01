import mongoose from 'mongoose';

export enum USER_ROLE_ENUM {
  ADMIN = 'admin',
  USER = 'user',
}

export type RequestUserPayload = {
  id: mongoose.Types.ObjectId;
  email?: string;
  role?: USER_ROLE_ENUM;
} | null;

declare global {
  namespace Express {
    interface Request {
      user: RequestUserPayload;
    }
  }
}
