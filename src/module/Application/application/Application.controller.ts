import { Request, Response } from 'express';
import ApplicationService from './Application.service';
import fs from 'fs';
import mime from 'mime-types';
import jwt from 'jsonwebtoken';
import UserService from '../../Account/User/User.service';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Application from './Application.model';
import mongoose from 'mongoose';
class ApplicationController {
    async getApplications(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        const params: any = {
            status: req.query.status,
            createdAt: req.query.createdAt,
            name: req.query.name,
            Categorie: req.query.Categorie,
            platform: req.query.platform
        }
        try {
            const LApplication = await ApplicationService.getApplication(decoded.UserId, Number(req.query.page), Number(req.query.limit), params);
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getApplicationsbyAdmin(req: Request, res: Response) {
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        const params: any = {
            status: req.query.status,
            createdAt: req.query.createdAt,
            name: req.query.name,
            Categorie: req.query.Categorie,
            platform: req.query.platform
        }
        try {
            const LApplication = await ApplicationService.getApplication(decoded.UserId, Number(req.query.page), Number(req.query.limit), params);
            res.status(201).json(LApplication);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async findApplications(req: Request, res: Response) {
        const application = req.params.id;
        console.log(application);

        try {
            const App = await ApplicationService.findApplication(application);
            res.status(200).json(App);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async createApplications(req: Request, res: Response) {
        const { Name, URI, Categorie, platform, UriRedirection, Origin } = req.body;
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const user = await ApplicationService.createApplication(Name, decoded.UserId, URI, "/Application/Logo/" + req.file?.filename, Categorie, platform, UriRedirection, Origin);
            res.status(200).json({ message: " Applications created " });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "nouveau user Name inserer !" });
        }
    }
    async createApplicationByAdmin(req: Request, res: Response) {
        const { DomainName, Uri } = req.body;
        try {
            const user = await ApplicationService.createApplicationByAdmin(DomainName, Uri, new Date());
            res.status(201).json({ message: " Applications created " });
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
        const { status, DomainName, start, end, NameId, sort } = req.body;
        const token = req.header('x-auth-token');
        const decoded: any = token && jwt.decode(token);
        try {
            const LApplication = await ApplicationService.search(status, start, end, DomainName, decoded.UserId, NameId, sort);
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
    async getAppByAdmin(req: Request, res: Response) {
        const s: any = req.query.status
        try {
            const response = await ApplicationService.getAppByadmin(Number(req.query.page), Number(req.query.limit), s);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async getUserByAdmin(req: Request, res: Response) {
        try {
            const response = await UserService.getUserByadmin(Number(req.query.page), Number(req.query.limit), String(req.query.role));
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
    async validerApp(req: Request, res: Response) {
        const id = req.body.id;
        const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = req.body.io
        try {
            const app = await Application.findById(id)
            io.on('connection', (socket: Socket) => {
                console.log(socket);
                socket.broadcast.emit(app.authors.toString(), { type: "success", message: `your app_1 endpoint has been validated by Admin!` });
            });
            res.status(200).json("");
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
}
export default new ApplicationController();