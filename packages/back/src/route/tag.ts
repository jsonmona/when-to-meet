import { Router } from 'express';
import { defaultTag, searchTag } from '../controller/tag.ts';

const router = Router();

router.get('/default', defaultTag);
router.get('/search', searchTag);

export { router as tagRouter };
