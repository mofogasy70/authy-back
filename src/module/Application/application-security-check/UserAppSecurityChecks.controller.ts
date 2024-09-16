import { Request, Response } from 'express';
import UserAppSecurityChecksService from './UserAppSecurityChecks.service';
class UserAppSecurityChecksController {
    async getUserAppSecurityCheckss(req: Request, res: Response) {
        try {
            const LUserAppSecurityChecks = await UserAppSecurityChecksService.getUserAppSecurityCheckss();
            res.status(201).json(LUserAppSecurityChecks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createUserAppSecurityCheckss(req: Request, res: Response) {
        const {
            Attemps,
            Retries,
            Code,
            Validate,
            Blocage,
            UserAuthSetting
        } = req.body;
        try {
            const UserAppSecurityChecks = await UserAppSecurityChecksService.createUserAppSecurityCheckss(
                Attemps,
                Retries,
                Code,
                Validate,
                Blocage,
                UserAuthSetting
            );
            res.status(201).json({ message: " UserAppSecurityCheckss inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau UserAppSecurityChecks Name inserer !" });
        }
    }
    async updateUserAppSecurityCheckss(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const UserAppSecurityChecks = await UserAppSecurityChecksService.updateUserAppSecurityCheckss(id, newData);
            if (UserAppSecurityChecks) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteUserAppSecurityCheckss(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const UserAppSecurityChecks = await UserAppSecurityChecksService.deleteUserAppSecurityCheckss(id);
            if (UserAppSecurityChecks) {
                res.status(200).json({ message: 'User supprimer' });
            } else {
                res.status(404).json({ error: 'User non trouver' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'suppression non reussite' });
        }
    }
    async Check(req: Request, res: Response) {
        const { UserApplications, Security, object, type, UriRedirection } = req.body;
        try {
            res.status(200).json({ message: await UserAppSecurityChecksService.Check(UserApplications, Security, object, UriRedirection, type) });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }
    async Init(req: Request, res: Response) {
        const { UserApplications, Security } = req.body;
        try {
            res.status(200).json({ message: "code send successfull .You have " + await UserAppSecurityChecksService.Init(UserApplications, Security) + " attempt left" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }
}
export default new UserAppSecurityChecksController();