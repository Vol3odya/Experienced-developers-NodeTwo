import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import  validateBody  from '../utils/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import  isValidId  from '../middlewares/isValidd.js';
import { getUsersController, patchUsersWaterRateController, updateUserInfoController, updateUserPhotoController } from '../controllers/users.js';
import { updatePhotoSchema, updateUsersSchema, updateWateRateSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';

const usersRoter = Router();

usersRoter.use(authenticate);

usersRoter.get('/current', isValidId, ctrlWrapper(getUsersController));
usersRoter.patch('/waterRate', isValidId, validateBody(updateWateRateSchema), ctrlWrapper(patchUsersWaterRateController));
usersRoter.patch('/avatar', isValidId, upload.single('photo'), validateBody(updatePhotoSchema), ctrlWrapper(updateUserPhotoController));
usersRoter.patch('/update', isValidId, validateBody(updateUsersSchema), ctrlWrapper(updateUserInfoController));


export default usersRoter;
