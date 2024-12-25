import { Router } from "express";

import {
  addWaterController,
  deleteWaterController,
  patchWaterController,
  getTodayWaterController,
  getMonthWaterController

} from '../controllers/water.js';

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";

import  isValidId  from "../middlewares/isValidd.js";
import { authenticate } from "../middlewares/authenticate.js";


import {
  addWaterValidation,
  updateWaterValidation,
} from '../validation/water.js';


const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  validateBody(addWaterValidation),
  ctrlWrapper(addWaterController),
);

waterRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateWaterValidation),
  ctrlWrapper(patchWaterController),
);

waterRouter.delete('/:id', isValidId, ctrlWrapper(deleteWaterController));

waterRouter.get('/month/:month', ctrlWrapper(getMonthWaterController));

waterRouter.get('/day/:day', ctrlWrapper(getTodayWaterController));

export default waterRouter;
