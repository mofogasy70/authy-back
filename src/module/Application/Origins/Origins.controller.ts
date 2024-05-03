import { Request, Response } from 'express';
import OriginsService from './Origins.service';
import { API_URL } from '../../../config/constant';
class OriginsController {
    async getOriginss(req: Request, res: Response) {
        try {
            const LOrigins = await OriginsService.getOrigins();
            res.status(201).json(LOrigins);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findOriginss(req: Request, res: Response) {
        const application = req.params.id;
        try {
            const LOrigins = await OriginsService.findOrigins(application);
            res.status(201).json(LOrigins);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createOriginss(req: Request, res: Response) {
        const { value,Application } = req.body;
        try {
            const user = await OriginsService.createOrigins(value,Application);
            res.status(201).json({ message: " Originss inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateOriginss(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await OriginsService.updateOrigins(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteOriginss(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await OriginsService.deleteOrigins(id);
            if (user) {
                res.status(200).json({ message: 'User supprimer' });
            } else {
                res.status(404).json({ error: 'User non trouver' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'suppression non reussite' });
        }
    }
}
export default new OriginsController();