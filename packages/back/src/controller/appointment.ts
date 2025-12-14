import type { RequestHandler } from 'express';
import z from 'zod';
import { LocalDate, nativeJs } from 'js-joda';
import { appointmentService } from '../service/appointment.ts';
import {
  CountResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentResponse,
  UpdateAppointmentRequest,
} from '@when-to-meet/api';

export const countAllAppointments: RequestHandler<
  {},
  z.input<typeof CountResponse>
> = async (req, res) => {
  const count = await appointmentService.countAllAppointments();
  res.json({ count });
};

export const createAppointment: RequestHandler<
  {},
  z.input<typeof CreateAppointmentResponse>,
  z.infer<typeof CreateAppointmentRequest>
> = async (req, res) => {
  const key = await appointmentService.createAppointment(
    req.body.name,
    LocalDate.from(nativeJs(req.body.startDate)),
    LocalDate.from(nativeJs(req.body.endDate)),
    req.body.tags
  );

  res.json({ key });
};

export const getAppointment: RequestHandler<
  { key: string },
  z.input<typeof GetAppointmentResponse>
> = async (req, res) => {
  const key = req.params.key;

  const data = await appointmentService.getAppointment(key);
  if (data === null) {
    return res.sendStatus(404);
  }

  const encoded = GetAppointmentResponse.encode({
    ...data,
    tags: data.tags.map((x) => ({ ...x, id: x.id.toString() })),
    participants: data.participants.map((x) => ({
      ...x,
      id: x.id.toString(),
    })),
  });
  res.json(encoded);
};

export const updateAppointment: RequestHandler<
  { key: string },
  unknown,
  z.infer<typeof UpdateAppointmentRequest>
> = async (req, res) => {
  const key = req.params.key;

  await appointmentService.updateAppointment(
    key,
    req.body.name,
    LocalDate.from(nativeJs(req.body.startDate)),
    LocalDate.from(nativeJs(req.body.endDate)),
    req.body.tags
  );
  res.sendStatus(200);
};

export const deleteAppointment: RequestHandler<{ key: string }> = async (
  req,
  res
) => {
  const key = req.params.key;

  await appointmentService.deleteAppointment(key);
  res.sendStatus(200);
};
