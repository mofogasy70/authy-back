import { Request, Response } from 'express';
import RoleService from './Role.service';
class RoleController {
    async getRoles(req: Request, res: Response) {
        try {
            const LRole = await RoleService.getRoles();
            res.status(201).json(LRole);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createRoles(req: Request, res: Response) {
        const { Name,Value } = req.body;
        try {
            const user = await RoleService.createRoles(Name,Value);
            res.status(201).json({ message: " Roles inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateRoles(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await RoleService.updateRoles(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteRoles(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await RoleService.deleteRoles(id);
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
export default new RoleController();