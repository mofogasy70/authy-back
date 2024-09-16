
import path from 'path';
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });export const APP_PORT = process.env.APP_PORT

export const MONGODB_URI = process.env.MONGODB_URI
export const API_URL = process.env.API_URL
export const accountSid=process.env.accountSid
export const authToken=process.env.authToken
export const twilioNum=process.env.twilioNum
export const CODE_TOKEN=process.env.CODE_TOKEN