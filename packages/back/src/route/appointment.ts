import { Router } from 'express';
import { decodeZod } from '../middleware/decodeZod.ts';
import { parsePathParam } from '../middleware/path.ts';
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
router.get('/:key', parsePathParam, getAppointment);
router.put(
  '/:key',
  parsePathParam,
  decodeZod(UpdateAppointmentRequest),
  updateAppointment
);
router.delete('/:key', parsePathParam, deleteAppointment);

router.get('/:key/calendar/:year/:month', parsePathParam, getCalendarMonth);
router.put(
  '/:key/calendar',
  parsePathParam,
  decodeZod(UpdateAppointmentCalendarRequest),
  updateCalendar
);

export { router as appointmentRouter };
