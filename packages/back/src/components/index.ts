import { Router } from 'express';
import { health } from './health.ts';

export const rootRouter = Router();

rootRouter.get('/health', health);
