import express from 'express';
import { authCheck } from '../middlewares/auth-check.middleware';
import savedController from '../controllers/saved.controller';
const router = express.Router();

router.get('/', authCheck, savedController.getSaved);
router.post('/', authCheck, savedController.savedUnsaved);

export default router;
