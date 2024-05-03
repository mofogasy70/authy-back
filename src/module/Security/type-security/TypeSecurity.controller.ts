import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import TypeSecurityService from './TypeSecurity.service';
class TypeSecurityController {
    async getTypeSecuritys(req: Request, res: Response) {
        try {
            const LTypeSecurity = await TypeSecurityService.getTypeSecuritys();
            res.status(201).json(LTypeSecurity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async FindTypeSecuritysWithChild(req: Request, res: Response) {
        const Application=req.body.Application;
        try {
            const token = req.header('x-auth-token');
            const decoded: any = token && jwt.decode(token);
            const LTypeSecurity = await TypeSecurityService.FindTypeSecuritysWithChild(Application,decoded.UserId);
            res.status(201).json(LTypeSecurity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createTypeSecuritys(req: Request, res: Response) {
        const {  Name,Description } = req.body;
        try {
            const user = await TypeSecurityService.createTypeSecuritys(Name,Description);
            res.status(201).json({ message: " TypeSecuritys inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateTypeSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await TypeSecurityService.updateTypeSecuritys(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteTypeSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await TypeSecurityService.deleteTypeSecuritys(id);
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
export default new TypeSecurityController();