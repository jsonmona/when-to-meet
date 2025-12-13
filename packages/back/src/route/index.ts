import { Router } from 'express';
import { healthRouter } from './health.ts';
import { appointmentRouter } from './appointment.ts';

export const rootRouter = Router();

rootRouter.use('/health', healthRouter);
rootRouter.use('/appointment', appointmentRouter);
