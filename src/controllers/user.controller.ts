import { Request, Response } from 'express';
import { validateUserPhoneNumber, validateCode } from '../util/validate';
import UserModel from '../models/user.model';
import Code from '../models/code.model';
import { User } from '../types';
import { sendSMS } from '../util/sendsms';
import generateCode from '../util/genCode';
import isPhoneExitAndCodeUsed from '../util/isPhoneExistAndCodeUsed';

const getUsers = (_req: Request, res: Response) => {
  res.send({ message: 'get all users method' });
};

const getSingleUser = (_req: Request, res: Response) => {
  res.send({ message: 'get single user method' });
};

const createUserCode = async (req: Request, res: Response) => {
  try {
    const phone: User = req.body;
    //validate user phone number
    const { error } = validateUserPhoneNumber(phone);
    if (error) return res.status(400).send(error.details[0].message);
    // check if user phone number already exist
    const isExist = await isPhoneExitAndCodeUsed(phone.phone);
    if (isExist) {
      // exist, generate new code
      const code = await generateCode();
      // send new code to users
      const sendSMSCode = await sendSMS(phone, code);
      // check if code was sent
      if (sendSMSCode) {
        // code sent, update code for user phone number
        const updateUserCode = await Code.updateOne(
          { phone: phone.phone },
          { $set: { code: code } },
        );
        // send response to user
        return res.status(201).send({
          data: updateUserCode,
          message: 'Please check your phone for verification code',
        });
      }
    }
    // user phone number do not exist
    // generate new code
    const code = await generateCode();
    // send new code to user phone
    const sendSMSCode = await sendSMS(phone, code);
    // check if code is sent
    if (sendSMSCode) {
      // code sent, add user and code to db
      const savedUserNumberAndCode = await Code.create({
        code,
        phone: phone.phone,
      });
      // send response
      return res.status(201).send({
        data: savedUserNumberAndCode,
        message: 'Please check your phone for verification code',
      });
    }

    return res
      .status(401)
      .send({ data: null, message: 'Something went wrong, Please Try again' });
  } catch (error) {
    res.status(401).send(error.message);
  }
  return;
};

const createUser = async (req: Request, res: Response) => {
  try {
    // get user code
    const { error } = validateCode(req.body);
    const code = req.body.code;
    // validate user code
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, data: null });
    const getUserInformation = await Code.findOne({ code });
    // console.log(getUserInformation.phone);
    if (getUserInformation) {
      // check if number already exist
      const getUser = UserModel.findOne({
        // @ts-ignore
        phone: getUserInformation.phone,
      });

      if (getUser) {
        return res.status(201).send({
          message: 'Already a rider, take token then proceed',
          data: getUserInformation,
        });
      }
      const createUser = await UserModel.create({
        // @ts-ignore
        phone: getUserInformation.phone,
        // @ts-ignore
        code: getUserInformation.code,
      });
      // send response with created data
      return res
        .status(201)
        .send({ data: createUser, message: 'Signup successfully!' });
    }
    // send something went wrong response
    return res
      .status(404)
      .send({ message: 'Credentials not found', data: null });
  } catch (error) {
    res.status(401).send({ Error: error.message });
  }
  return;
};

const updateUser = (_req: Request, res: Response) => {
  res.send({ message: 'update users method' });
};

const deleteUser = (_req: Request, res: Response) => {
  res.send({ message: 'delete user method' });
};

export default {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createUserCode,
};
