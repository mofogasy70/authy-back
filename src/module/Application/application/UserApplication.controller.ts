import { Request, Response } from 'express';
import UserApplicationService from './UserApplication.service';
import jwt from 'jsonwebtoken';
class UserApplicationController {
    async getUserApplications(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LUserApplication = await UserApplicationService.getUserApplications(decoded.UserId, Number(req.query.limit), Number(req.query.page));
            res.status(200).json(LUserApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findAppByUserId(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LUserApplication = await UserApplicationService.findAppByUserId(decoded.UserId);
            res.status(201).json(LUserApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createUserApplications(req: Request, res: Response) {
        const { Application, User } = req.body;
        try {
            const user = await UserApplicationService.createUserApplications(
                Application,
                User);
            res.status(201).json({ message: " UserApplications inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateUserApplications(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await UserApplicationService.updateUserApplications(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteUserApplications(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await UserApplicationService.deleteUserApplications(id);
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
    async getUserAppConformed(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LUserApplication = await UserApplicationService.getUserAppConformed(decoded.UserId);
            res.status(200).json(LUserApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
}
export default new UserApplicationController();