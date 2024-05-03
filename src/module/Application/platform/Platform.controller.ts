import { Request, Response } from 'express';
import PlatformService from './Platform.service';
import { API_URL } from '../../../config/constant';
class PlatformController {
    async getPlatforms(req: Request, res: Response) {
        try {
            const LPlatform = await PlatformService.getPlatform();
            res.status(201).json(LPlatform);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findPlatforms(req: Request, res: Response) {
        const application = req.params.id;
        try {
            const LPlatform = await PlatformService.findPlatform(application);
            res.status(201).json(LPlatform);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createPlatforms(req: Request, res: Response) {
        const { Name } = req.body;
        try {
            const user = await PlatformService.createPlatform(Name);
            res.status(201).json({ message: " Platforms inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updatePlatforms(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await PlatformService.updatePlatform(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deletePlatforms(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await PlatformService.deletePlatform(id);
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
export default new PlatformController();