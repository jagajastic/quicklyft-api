import express from 'express';
import userController from '../../controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/phone').post(userController.createUserCode);

export default router;
