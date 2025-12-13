import { Router } from 'express';
import { decodeZod } from '../middleware/decodeZod.ts';
import {
  createParticipant,
  deleteParticipant,
  updateParticipant,
} from '../controller/participant.ts';
import {
  CreateParticipantRequest,
  UpdateParticipantRequest,
} from '@when-to-meet/api';

const router = Router();

router.post('/', decodeZod(CreateParticipantRequest), createParticipant);
router.put('/:id', decodeZod(UpdateParticipantRequest), updateParticipant);
router.delete('/:id', deleteParticipant);

export { router as participantRouter };
