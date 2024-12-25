import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const userId = req.user._id;

  if (isValidObjectId(userId) !== true) {
    return next(createHttpError.NotFound('Id is not valid!'));
  }
  next();
};

export default isValidId;
