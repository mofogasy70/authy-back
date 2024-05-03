import MailController from './Mail.controller';
import { Router } from 'express';

const Mailrouter = Router();
Mailrouter.get("/", MailController.sendEmailCode);
export default Mailrouter;