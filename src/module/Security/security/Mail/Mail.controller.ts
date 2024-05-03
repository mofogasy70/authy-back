import { Request, Response } from 'express';
import MailService from './Mail.service';
class MailController {
    async sendEmailCode(req: Request, res: Response) {
        try {
            const valiny=await MailService.sendEmailCode(req.body.Mail,req.body.Code);
            res.status(201).json(valiny);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}
export default new MailController();