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
  unknown,
  z.input<typeof CountResponse>
> = async (req, res) => {
  const count = await appointmentService.countAllAppointments();
  res.json({ count });
};

export const createAppointment: RequestHandler<
  unknown,
  z.input<typeof CreateAppointmentResponse>,
  z.infer<typeof CreateAppointmentRequest>
> = async (req, res) => {
  const { id, nonce } = await appointmentService.createAppointment(
    req.body.name,
    LocalDate.from(nativeJs(req.body.startDate)),
    LocalDate.from(nativeJs(req.body.endDate)),
    req.body.tags
  );

  res.status(201).json(CreateAppointmentResponse.encode({ key: [id, nonce] }));
};

export const getAppointment: RequestHandler<
  { key: string },
  z.input<typeof GetAppointmentResponse>
> = async (req, res) => {
  const [id, nonce] = req.parsedParam.key!;

  const data = await appointmentService.getAppointment(id, nonce);
  if (data === null) {
    return res.sendStatus(404);
  }

  res.json(GetAppointmentResponse.encode(data));
};

export const updateAppointment: RequestHandler<
  { key: string },
  unknown,
  z.infer<typeof UpdateAppointmentRequest>
> = async (req, res) => {
  const [id, nonce] = req.parsedParam.key!;

  await appointmentService.updateAppointment(
    id,
    nonce,
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
  const [id, nonce] = req.parsedParam.key!;

  await appointmentService.deleteAppointment(id, nonce);
  res.sendStatus(200);
};
