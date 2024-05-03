import { Request, Response } from 'express';
import SMSservice from './SMS.service';
class SMSController {
    async SMSsendcode(req: Request, res: Response) {
        try {
            const valiny=await SMSservice.SMSsendcode("+261345125754","234567");
            res.status(201).json(valiny);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
        
    }
}
export default new SMSController();