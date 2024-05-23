import { Request, Response } from 'express';
import ApplicationService from './Application.service';
import fs from 'fs';
import mime from 'mime-types';
import jwt from 'jsonwebtoken';
import { API_URL } from '../../../config/constant';
class ApplicationController {
    async getApplications(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LApplication = await ApplicationService.getApplication(decoded.UserId);
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findApplications(req: Request, res: Response) {
        const application = req.params.id;
        try {
            const LApplication = await ApplicationService.findApplication(application);
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createApplications(req: Request, res: Response) {
        const { DomainName, Uri, Categorie, Platform, UriRedirection } = req.body;
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const user = await ApplicationService.createApplication(DomainName, decoded.UserId, Uri,"/Application/Logo/" + req.file?.filename, Categorie, Platform, UriRedirection);
            res.status(201).json({ message: " Applications inserer dans la base de donnee " });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async createApplicationByAdmin(req: Request, res: Response) {
        const { DomainName, Uri } = req.body;
        try {
            const user = await ApplicationService.createApplicationByAdmin(DomainName, Uri, new Date());
            res.status(201).json({ message: " Applications inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async updateApplications(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await ApplicationService.updateApplication(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteApplications(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await ApplicationService.deleteApplication(id);
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
    async getApproved(req: Request, res: Response) {
        try {
            const LApplication = await ApplicationService.getApproved();
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getHoldOn(req: Request, res: Response) {
        try {
            const LApplication = await ApplicationService.getHoldOn();
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getNotApproved(req: Request, res: Response) {
        try {
            const LApplication = await ApplicationService.getNotApproved();
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async search(req: Request, res: Response) {
        const { status, DomainName, start, end ,NameId ,sort} = req.body;
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LApplication = await ApplicationService.search(status, start, end, DomainName,decoded.UserId,NameId,sort);
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getLogo(req: Request, res: Response) {
        const path = await ApplicationService.getLogo(req.params.Name);
        const type = mime.contentType(path);
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(404).send(err);
            }
            res.writeHead(200, { 'content-type': '' + type });
            res.end(data);
        });
    }

}
export default new ApplicationController();