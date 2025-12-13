import { Router } from 'express';
import { countAllAppointments } from '../controller/appointment.ts';

export const appointmentRouter = Router();

appointmentRouter.get('/count', countAllAppointments);
