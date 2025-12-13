import { Router } from 'express';
import { decodeZod } from '../middleware/decodeZod.ts';
import {
  countAllAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controller/appointment.ts';
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@when-to-meet/api';

const router = Router();

router.get('/count', countAllAppointments);
router.post('/', decodeZod(CreateAppointmentRequest), createAppointment);
router.get('/:key', getAppointment);
router.put('/:key', decodeZod(UpdateAppointmentRequest), updateAppointment);
router.delete('/:key', deleteAppointment);

export { router as appointmentRouter };
