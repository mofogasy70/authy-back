import { Request, Response } from 'express';
import UserAppSecurityService from './UserAppSecurity.service';
class UserAppSecurityController {
    async getUserAppSecuritys(req: Request, res: Response) {
        try {
            const LUserAppSecurity = await UserAppSecurityService.getUserAppSecuritys();
            res.status(201).json(LUserAppSecurity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createUserAppSecuritys(req: Request, res: Response) {
        const {
            MaxAttemps,
            MaxRetries,
            ValidityTime,
            Status,
            UserApplication,
            Security
        } = req.body;
        try {
            const UserAppSecurity = await UserAppSecurityService.createUserAppSecuritys(
                MaxAttemps,
                MaxRetries,
                ValidityTime,
                Status,
                UserApplication,
                Security);
            res.status(201).json({ message: " UserAppSecuritys inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau UserAppSecurity Name inserer !" });
        }
    }
    async updateUserAppSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const UserAppSecurity = await UserAppSecurityService.updateUserAppSecuritys(id, newData);
            if (UserAppSecurity) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteUserAppSecuritys(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const UserAppSecurity = await UserAppSecurityService.deleteUserAppSecuritys(id);
            if (UserAppSecurity) {
                res.status(200).json({ message: 'User supprimer' });
            } else {
                res.status(404).json({ error: 'User non trouver' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'suppression non reussite' });
        }
    }
    async chageStatus(req: Request, res: Response) {
        const { userAppSecurity, status } = req.body;
        try {
            //console.log(userAppSecurity);
            const UserAppSecurity = await UserAppSecurityService.chageStatus(userAppSecurity, status);
            res.status(200).json({ message: 'status changed' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'change status failed' });
        }
    }

}
export default new UserAppSecurityController();