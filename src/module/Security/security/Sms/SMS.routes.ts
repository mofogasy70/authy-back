import SMSController from './SMS.controller';
import { Router } from 'express';

const SMSrouter = Router();
SMSrouter.get("/", SMSController.SMSsendcode);
export default SMSrouter;