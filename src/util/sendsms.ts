import { User } from '../types';
import dotenv from 'dotenv';
dotenv.config();

const accountId = `${process.env.TWILIO_ACCOUNT_ID}`;
const token = `${process.env.TWILIO_TOKEN}`;

const client = require('twilio')(accountId, token);

export const sendSMS = async (phone: User, code: string) => {
  return await client.messages
    .create({
      body: `Your Quicklyft verification code is: ${code}`,
      from: '+12053045954',
      to: phone.phone,
    })
    //@ts-ignore
    .then(message => message.sid);
};
