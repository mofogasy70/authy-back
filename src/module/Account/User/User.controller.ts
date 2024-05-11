import UserService from "./User.service";
import { Request, Response } from 'express';
import fs from 'fs';
import mime from 'mime-types';
import { sign, verify } from "jsonwebtoken";
import { API_URL } from "../../../config/constant";
import Stripe from "stripe";
class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const Luser = await UserService.getUsers();
            res.status(201).json(Luser);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async FindUsersById(req: Request, res: Response) {
        const { _id } = req.params;
        try {
            const Luser = await UserService.FindUsersById(_id);
            res.status(201).json(Luser);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async createUsers(req: Request, res: Response) {
        const { Name, LastName, DateBirth, Address, PhoneNumber, Password, Role, Mail } = req.body;
        try {
            const user = await UserService.createUsers(Name, LastName, DateBirth, Address, PhoneNumber, Password, Role, Mail);
            res.status(201).json({ message: " Users inserer dans la base de donnee " });
        } catch (error) {
            res.status(500).json({ error: "" + error });
        }
    }
    async Register(req: Request, res: Response) {
        const { Name, LastName, DateBirth, Address, PhoneNumber, Password, Mail } = req.body;
        try {
            const user = await UserService.createUsers_2(Name, LastName, DateBirth, Address, PhoneNumber, Password, Mail, "defautl.png");
            res.status(201).json({ message: " Users Registered" });
        } catch (error) {
            res.status(500).json({ error: "" + error });
        }
    }
    async updateUsers(req: Request, res: Response) {
        const id = req.params.id;
        const newData = req.body;
        try {
            const user = await UserService.updateUsers(id, newData);
            if (user) {
                res.status(200).json({ message: "User mit a jour" });
            } else {
                res.status(404).json({ error: 'User Name trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User Name modifiable' });
        }
    }
    async deleteUsers(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const user = await UserService.deleteUsers(id);
            if (user) {
                res.status(200).json({ message: 'User supprimer' });
            } else {
                res.status(404).json({ error: 'User non trouver' });
            }
        } catch (error) {
            res.status(500).json({ error: 'suppression non reussite' });
        }
    }
    async Authentication(req: Request, res: Response) {
        try {
            const { Mail, Password, info } = req.body;
            const ip: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            try {
                const valiny = await UserService.Authentication(Mail, Password, info, ip);
                res.status(200).json({ valiny });
            } catch (error) {
                throw error
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }
    async Authentication_2(req: Request, res: Response) {
        try {
            const { Mail, Password, info, AppID } = req.body;
            const ip: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            try {
                const valiny = await UserService.Authentication_2(Mail, Password, info, AppID, ip);
                res.status(200).json({ valiny });
            } catch (error) {
                throw error
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }
    async getAvatar(req: Request, res: Response) {
        const path = await UserService.getAvatar(req.params.Name);
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
    async checkToken(req: Request, res: Response) {
        const token = req.body.token;
        try {
            const valiny = await UserService.checkToken(token);
            res.status(200).json({ response: valiny });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }
    async updateName(req: Request, res: Response) {
        const id = req.params.id;
        const Name = req.body.Name;
        try {
            await UserService.updateName(id, Name).then((response) => {
                res.status(200).json({ message: "User mit a jour" });
            }).catch((error) => {
                res.status(500).json({ error: error });
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async updateLastName(req: Request, res: Response) {
        const id = req.params.id;
        const LastName = req.body.LastName;
        try {
            await UserService.updateLastName(id, LastName).then((response) => {
                res.status(200).json({ message: "User mit a jour" });
            }).catch((error) => {
                res.status(500).json({ error: error });
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async updateDateBirth(req: Request, res: Response) {
        const id = req.params.id;
        const DateBirth = req.body.DateBirth;
        try {
            await UserService.updateDateBirth(id, DateBirth).then((response) => {
                res.status(200).json({ message: "User mit a jour" });
            }).catch((error) => {
                res.status(500).json({ error: error });
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async updateAddress(req: Request, res: Response) {
        const id = req.params.id;
        const Address = req.body.Address;
        try {
            await UserService.updateAddress(id, Address).then((response) => {
                res.status(200).json({ message: "User mit a jour" });
            }).catch((error) => {
                res.status(500).json({ error: error });
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async updatePhoneNumber(req: Request, res: Response) {
        const id = req.params.id;
        const PhoneNumber = req.body.PhoneNumber;
        try {
            await UserService.updatePhoneNumber(id, PhoneNumber).then((response) => {
                res.status(200).json({ message: "User mit a jour" });
            }).catch((error) => {
                res.status(500).json({ error: error });
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async getclient(req: Request, res: Response) {
        try {
            const Luser = await UserService.getclient();
            res.status(201).json(Luser);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async getAdmin(req: Request, res: Response) {
        try {
            const Luser = await UserService.getAdmin();
            res.status(201).json(Luser);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async getDev(req: Request, res: Response) {
        try {
            const Luser = await UserService.getDev();
            res.status(201).json(Luser);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    async exchangeToken(req: Request, res: Response) {
        const accessToken = req.body.accessToken;
        try {
            const valiny = await UserService.exchangeToken(accessToken);
            res.status(200).json({ response: valiny });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "" + error });
        }
    }

    async subscription(req: Request, res: Response) {

        const { email, payment_method } = req.body;
        console.log(" SUBSCRIPTION " + JSON.stringify(req.body, null, 2));
        try {
            const stripe = new Stripe(
                "pk_test_51OHJQsBvc6PWAdhY9IjFuR7LmbdkDarPvL5i4Z1HYNhWLK0lwNXAFfT75LatRfPr4MgQM9XAh9yN5MCo7AJVHlqU00tMeFNUAm"
            );
            const customer = await stripe.customers.create({
                payment_method: payment_method,
                email: email,
            });

            const subscription: any = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: "price_1OHJdTBvc6PWAdhYogLOcCxC" }],
                expand: ["latest_invoice.payment_intent"],
            });
            const status = subscription["latest_invoice"]["payment_intent"]["status"];
            const client_secret =
                subscription["latest_invoice"]["payment_intent"]["client_secret"];

            res
                .status(200)
                .json({ client_secret: client_secret, status: status });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    async test(req: Request, res: Response) {
        res.status(200).json({ response: "mety" });
    }
}
export default new UserController();