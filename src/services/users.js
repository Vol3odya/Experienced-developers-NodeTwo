import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';

export const getUserProfile = async (userId) => {
  const user = await UserCollection.findById({ _id: userId });



  return {
    name: user.name,
    email: user.email,
    gender: user.gender,
    waterRate: user.waterRate,
    photo: user.photo,
  };
};

export const patchUserWaterRate = async (userId, newWaterRate) => {

  const user = await UserCollection.findByIdAndUpdate({ _id: userId }, { waterRate: newWaterRate }, { new: true });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserPhoto = async (userId, photo) => {

  const userPhoto = await UserCollection.findByIdAndUpdate({ _id: userId }, photo, {
    new: true,
    includeResultMetadata: true,
  });

  if (!userPhoto || !userPhoto.value) return null;

  return {
    user: userPhoto.value,
    isNew: Boolean(userPhoto?.lastErrorObject?.upserted),
  };

};

export const updateUserInfo = async (body, user) => {
  console.log(body);
  const { password, _id } = user;

  if (body.outdatePassword && !body.password) {
    throw createHttpError(400, 'New password is missing!');
    }

  if (body.password && body.outdatePassword) {
    const isPasswordCorrect = await bcrypt.compare(body.outdatePassword, password);

    if (!isPasswordCorrect) {
      throw createHttpError(401, 'Invalid password');
    }
    body.password = await bcrypt.hash(body.password, 10);
    }

  const newUser = await UserCollection.findOneAndUpdate({_id}, body, {
    new: true,
    includeResultMetadata: true,
    runValidators: true,
  });


  if (!newUser || !newUser.value) return null;


  return {
    user: newUser.value,
    isNew: Boolean(newUser?.lastErrorObject?.upserted),
  };

};
