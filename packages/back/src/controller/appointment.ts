import type { RequestHandler } from 'express';
import { appointmentService } from '../service/appointment.ts';

export const countAllAppointments: RequestHandler = async (req, res) => {
  const count = await appointmentService.countAllAppointments();
  res.json({ count });
};
