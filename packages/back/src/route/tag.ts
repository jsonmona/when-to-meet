import { Router } from 'express';
import { defaultTag, searchTag, createTag } from '../controller/tag.ts';
import { TagCreateRequest } from '@when-to-meet/api';
import { decodeZod } from '../middleware/decodeZod.ts';

const router = Router();

router.get('/default', defaultTag);
router.get('/search', searchTag);
router.post('/', decodeZod(TagCreateRequest), createTag);

export { router as tagRouter };
