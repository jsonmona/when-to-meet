import { Router } from 'express';
import { searchTag } from '../controller/tag.ts';

const router = Router();

router.get('/search', searchTag);

export { router as tagRouter };
