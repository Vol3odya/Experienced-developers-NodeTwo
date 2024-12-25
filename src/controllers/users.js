import createHttpError from 'http-errors';
import { getUserProfile, patchUserWaterRate, updateUserInfo, updateUserPhoto } from '../services/users.js';
import {saveFileToCloudinary} from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import { env } from '../utils/env.js';

export const getUsersController = async (req, res, next) => {
  

  const userById = await getUserProfile(req.user._id);

  if (userById === null) {
    return next(createHttpError('User not found'));
  }

  res.send({
    status: 200,
    message: `User successfully found`,
    data: userById,
  });
};


export const patchUsersWaterRateController = async (req, res, next) => {

  const userId = req.user._id;
  const { dailyNorma } = req.body;

   const updateUser = await patchUserWaterRate(userId, dailyNorma);

  if (updateUser === null) {
    return next(createHttpError('User not found'));
  }

  res.send({
    status: 200,
    message: `User's ${updateUser.waterRate} WaterRate`,
    data: updateUser.waterRate,
  });

};

export const updateUserPhotoController = async (req, res, next) => {

   const userId = req.user._id;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const update = await updateUserPhoto(userId, { photo: photoUrl });

  if (!update) throw createHttpError(404, 'User not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a photo',
    data: update.user.photo,
  });
};

export const updateUserInfoController = async (req, res) => {

  const user = req.user;
  const body = req.body;


  const data = await updateUserInfo(body, user);

  if (!data) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: 'Info of user successfully updated',
    data,
  });

};


