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
  UpdateAppointmentCalendarRequest,
  UpdateAppointmentRequest,
} from '@when-to-meet/api';
import { getCalendarMonth, updateCalendar } from '../controller/calendar.ts';

const router = Router();

router.get('/count', countAllAppointments);
router.post('/', decodeZod(CreateAppointmentRequest), createAppointment);
router.get('/:key', getAppointment);
router.put('/:key', decodeZod(UpdateAppointmentRequest), updateAppointment);
router.delete('/:key', deleteAppointment);

router.get('/:key/calendar/:year/:month', getCalendarMonth);
router.put(
  '/:key/calendar',
  decodeZod(UpdateAppointmentCalendarRequest),
  updateCalendar
);

export { router as appointmentRouter };
