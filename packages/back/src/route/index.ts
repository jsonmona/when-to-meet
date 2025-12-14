import { Router } from 'express';
import { healthRouter } from './health.ts';
import { appointmentRouter } from './appointment.ts';
import { participantRouter } from './participant.ts';
import { tagRouter } from './tag.ts';

export const rootRouter = Router();

rootRouter.use('/health', healthRouter);
rootRouter.use('/appointment', appointmentRouter);
rootRouter.use('/participant', participantRouter);
rootRouter.use('/tag', tagRouter);
