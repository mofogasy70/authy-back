import { Request, Response } from 'express';
import ActivityService from './Activity.service';
class ActivityController {
    async getActivitys(req: Request, res: Response) {
        try {
            const LActivity = await ActivityService.getActivitys();
            res.status(200).json(LActivity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createActivitys(req: Request, res: Response) {
        const { status, description, date, routes, UserApplication } = req.body;
        try {
            const user = await ActivityService.createActivitys(status, description, date, routes, UserApplication);
            res.status(201).json({ message: " Activitys inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateActivitys(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await ActivityService.updateActivitys(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteActivitys(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await ActivityService.deleteActivitys(id);
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
    async getActivitysUser(req: Request, res: Response) {
        const UserApplication = req.params.UserApplication;
        try {
            const params:any = {
                status: req.query.status,
                createdAt: req.query.createdAt,
                description: req.query.description,
                UserApplication: req.query.UserApplication,
            }
            const LActivity = await ActivityService.getActivitysUser(UserApplication, Number(req.query.page), Number(req.query.limit), params);
            res.status(200).json(LActivity);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }

}
export default new ActivityController();