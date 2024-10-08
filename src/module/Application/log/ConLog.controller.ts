import { Request, Response } from 'express';
import ConLogService from './ConLog.service';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
class ConLogController {
    async getIntervalConlog(req: Request, res: Response) {
        const { date } = req.body;
        const Application: string[] = req.body.Application;
        try {
            const valiny: any[] = [];
            const token = req.header('x-auth-token');
            const decoded: any = token && jwt.decode(token);
            const Datetemp = new Date(date);
            const datef = new Date(Datetemp.getFullYear(), Datetemp.getMonth() + 1, 0);

            for (let index = 0; index < Application.length; index++) {
                const LConLog = await ConLogService.getIntervalConlog(
                    new Date(Datetemp.getFullYear() + '-' + (Datetemp.getMonth() + 1) + '-01'),
                    new Date(Datetemp.getFullYear() + '-' + (Datetemp.getMonth() + 1) + '-' + datef.getDate()),
                    new mongoose.Types.ObjectId(Application[index]),
                    new mongoose.Types.ObjectId(decoded.UserId));
                valiny.push(LConLog);
            }
            res.status(201).json(valiny);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getDeviceList(req: Request, res: Response) {
        const { Application } = req.body;
        try {
            let valiny: any;;
            const token = req.header('x-auth-token');
            const decoded: any = token && jwt.decode(token);
            valiny = await ConLogService.getDeviceList(Application, decoded.UserId);
            res.status(201).json(valiny);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getConLogs(req: Request, res: Response) {
        const params: any = {
            status: req.query.status,
            date: req.query.date,
            UserApplication: req.query.UserApplication,
        }
        try {
            const response = await ConLogService.getConLogs(Number(req.query.page), Number(req.query.limit), params);
            res.status(201).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getWeekleConLogs(req: Request, res: Response) {
        try {
            const response = await ConLogService.getWeekleConLogs();
            res.status(201).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
}
export default new ConLogController();