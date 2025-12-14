import type { RequestHandler } from 'express';
import z from 'zod';
import { participantService } from '../service/participant.ts';
import {
  CreateParticipantRequest,
  CreateParticipantResponse,
  UpdateParticipantRequest,
} from '@when-to-meet/api';

export const createParticipant: RequestHandler<
  {},
  z.input<typeof CreateParticipantResponse>,
  z.infer<typeof CreateParticipantRequest>
> = async (req, res) => {
  const [appointmentId, nonce] = req.body.appointmentKey;

  const id = await participantService.createParticipant(
    appointmentId,
    nonce,
    req.body.name
  );

  if (id === null) {
    return res.sendStatus(404);
  }

  res.status(201).json(CreateParticipantResponse.encode({ id }));
};

export const updateParticipant: RequestHandler<
  { id: string },
  unknown,
  z.infer<typeof UpdateParticipantRequest>
> = async (req, res) => {
  const id = req.parsedParam.id!;

  await participantService.updateParticipant(id, req.body.name);
  res.sendStatus(200);
};

export const deleteParticipant: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const id = req.parsedParam.id!;

  await participantService.deleteParticipant(id);
  res.sendStatus(200);
};
