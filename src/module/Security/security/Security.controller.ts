import { Request, Response } from 'express';
import SecurityService from './Security.service';
class SecurityController {
    async getSecuritys(req: Request, res: Response) {
        try {
            const LSecurity = await SecurityService.getSecuritys();
            res.status(201).json(LSecurity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createSecuritys(req: Request, res: Response) {
        const { Name, TypeSecurity } = req.body;
        try {
            const user = await SecurityService.createSecuritys(Name, TypeSecurity);
            res.status(201).json({ message: " Securitys inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await SecurityService.updateSecuritys(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await SecurityService.deleteSecuritys(id);
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
export default new SecurityController();