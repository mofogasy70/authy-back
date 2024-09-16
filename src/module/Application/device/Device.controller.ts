import { Request, Response } from 'express';
import DeviceService from './Device.service';
class DeviceController {
    async getDevice(req: Request, res: Response) {
        try {
            console.log(req.params.userApplication);
            const response = await DeviceService.getdevices(Number(req.query.status), req.params.userApplication, Number(req.query.page), Number(req.query.limit));
            res.status(201).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async blokDevice(req: Request, res: Response) {
        try {
            await DeviceService.blokDevice(req.body.id);
            res.status(200).json({ message: "Device updated" })
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async AllowDevice(req: Request, res: Response) {
        try {
            await DeviceService.AllowDevice(req.body.id);
            res.status(200).json({ message: "Device updated" })
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}
export default new DeviceController();