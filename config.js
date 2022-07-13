import 'dotenv/config';
import parseArgs from 'minimist';

const options = {
  alias: {
    p: 'port',
    m: 'mode',
  },
  default: {
    port: 8080,
    mode: 'FORK',
  },
};
const args = parseArgs(process.argv.slice(2), options);

export const APP_MODE = process.env.APP_MODE || args.mode;
export const PERSISTENCE = process.env.PERSISTENCE;
export const PORT = process.env.PORT || args.port;
export const HOST = process.env.HOST || `http://localhost:${PORT}`;
export const mongoRemote = {
  client: 'mongodb',
  url: process.env.MONGO_URL,
  advancedOptions: { useNewUrlParser: true, useUnifiedTopology: true },
};
export const LOG_LEVEL = process.env.LOG_LEVEL;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 12;
export const BCRYPT_SECRET = process.env.BCRYPT_SECRET || 'BCryPt_S3cR3t.';
export const ADMIN_MAIL = process.env.ADMIN_MAIL;
export const ADMIN_MAIL_PWD = process.env.ADMIN_MAIL_PWD;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;
export const TWILIO_WAP_NUMBER = process.env.TWILIO_WAP_NUMBER;
export const TWILIO_WAP_ADM_NMBR = process.env.TWILIO_WAP_ADM_NMBR;
export const SESSION_SECRET = process.env.SESSION_SECRET;
