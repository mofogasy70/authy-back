import { Request, Response } from 'express';
import CategorieService from './Categorie.service';
import { API_URL } from '../../../config/constant';
class CategorieController {
    async getCategories(req: Request, res: Response) {
        try {
            const LCategorie = await CategorieService.getCategorie();
            res.status(201).json(LCategorie);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findCategories(req: Request, res: Response) {
        const application = req.params.id;
        try {
            const LCategorie = await CategorieService.findCategorie(application);
            res.status(201).json(LCategorie);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createCategories(req: Request, res: Response) {
        const { Name } = req.body;
        try {
            const user = await CategorieService.createCategorie(Name);
            res.status(201).json({ message: " Categories inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateCategories(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await CategorieService.updateCategorie(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteCategories(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await CategorieService.deleteCategorie(id);
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
export default new CategorieController();