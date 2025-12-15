import { Router } from 'express';
import { forgeCsrf } from '../controller/auth.ts';

const router = Router();

router.get('/csrf-token', forgeCsrf);

export { router as authRouter };
