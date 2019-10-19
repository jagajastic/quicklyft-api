import { Router } from 'express';
import sampleController from '../controllers/sample';

import userRoute from './user/user.route';

const router = Router();

router.get('/', function(_req, res, _next) {
  const message = sampleController();

  res.status(200).json({ message });
});

router.use('/user', userRoute);

export default router;
