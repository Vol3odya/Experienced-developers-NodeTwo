import UserCollection from "../db/models/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import SessionCollection from "../db/models/Session.js";
import { randomBytes } from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR } from "../constants/index.js";
import { getFullNameFromGoogleTokenPayload, validateCode } from "../utils/googleOAuth2.js";



const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  };
};

export const register = async payload => {
    const { email, password} = payload;
    const user = await UserCollection.findOne({ email });
    if (user) {
        throw createHttpError(409, "Email already in use.");
    }
  const hashpassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashpassword
  });



  const newSession = createSession();


  const session = await SessionCollection.create({userId: newUser._id,
    ...newSession,
  });





  return {
    user: {
      name: newUser.name,
      email: newUser.email,
      gender: newUser.gender,
      waterRate: newUser.waterRate,
      photo: newUser.photo,
    },
    session,
  };
};

export const login = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Email or password invalid.");
    }
    await SessionCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      waterRate: user.waterRate,
      photo: user.photo,
    },
    session,
  };
};


export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found.");
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, "Session token expired.");
  }

  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  const newSessionRecord = await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });

  const user = await UserCollection.findOne({ _id: session.userId });


  if (!user) {
    throw createHttpError(404, "User not found.");
  }
  return {
    session: newSessionRecord,
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      waterRate: user.waterRate,
      photo: user.photo,
    },
  };
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};


export const findSession = filter => SessionCollection.findOne(filter);
export const findUser = filter => UserCollection.findOne(filter);

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};


export const loginOrSignupWithGoogle = async (code) => {

  const loginTicket = await validateCode(code);

  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  let user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });

};