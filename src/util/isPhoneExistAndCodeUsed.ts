import Code from '../models/code.model';

export default async function isPhoneExitAndCodeUsed(phone: string) {
  const userData = await Code.findOne({ phone: phone });
  if (userData) {
    return true;
  } else {
    return false;
  }
}
