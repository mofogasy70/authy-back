import { Request, Response } from 'express';
import RedirectService from './Redirect.service';
import { API_URL } from '../../../config/constant';
class RedirectController {
    async getRedirects(req: Request, res: Response) {
        try {
            const LRedirect = await RedirectService.getRedirect();
            res.status(201).json(LRedirect);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findRedirects(req: Request, res: Response) {
        const application = req.params.id;
        try {
            const LRedirect = await RedirectService.findRedirect(application);
            res.status(201).json(LRedirect);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createRedirects(req: Request, res: Response) {
        const { value,Application } = req.body;
        try {
            const user = await RedirectService.createRedirect(value,Application);
            res.status(201).json({ message: " Redirects inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateRedirects(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await RedirectService.updateRedirect(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteRedirects(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await RedirectService.deleteRedirect(id);
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
export default new RedirectController();