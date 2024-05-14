import mongoose from "mongoose";
import Application from "./Application.model";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import User from "../../Account/User/User.model";
import Role from "../../Account/Role/Role.model";

class ApplicationService {
    async getApplication(UserId: string) {
        try {
            const valiny = await Application.find({ AppId: { $ne: "d092530a-1386-4b90-9769-fcb4a38c477c" }, authors: new mongoose.Types.ObjectId(UserId) }).populate("Categorie").populate("Platform");
            console.log(valiny);
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findApplication(application: string) {
        try {
            const valiny = Application.findById(new mongoose.Types.ObjectId(application)).populate("Categorie").populate("Platform");
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createApplication(DomainName: string, User: string, Uri: string, Logo: string, Categorie: mongoose.Types.ObjectId, Platform: mongoose.Types.ObjectId, UriRedirection: string) {
        try {
            const AppId = await uuidv4();
            const AppKey = await uuidv4();
            const ApplicationTemp = new Application({
                DomainName,
                AppId,
                Uri,
                Logo,
                createdAt: new Date(),
                status: 1,
                UriRedirection: UriRedirection,
                Platform: Platform,
                Categorie: Categorie,
                AppKey: AppKey,
                authors: User,
                securityStatus: false
            });
            return await ApplicationTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createApplicationByAdmin(DomainName: string, Uri: string, createdAt: Date) {
        const AppId = await uuidv4();
        try {
            const ApplicationTemp = new Application({
                DomainName,
                AppId,
                User: "65141a2381c0dd4bfb1ef2ba",
                Uri,
                Logo: 'logo',
                createdAt
            });
            return await ApplicationTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteApplication(id: String) {
        try {
            return await Application.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateApplication(id: String, newData: object) {
        try {
            return await Application.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async generateRandomAppId(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        return result;
    }
    async getApproved() {
        try {
            const valiny = Application.find({ AppId: { $ne: "d092530a-1386-4b90-9769-fcb4a38c477c" }, status: 2 }).populate("Platform").populate("Categorie");
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async getHoldOn() {
        try {
            const valiny = Application.find({ AppId: { $ne: "d092530a-1386-4b90-9769-fcb4a38c477c" }, status: 1 });
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async getNotApproved() {
        try {
            const valiny = Application.find({ AppId: { $ne: "d092530a-1386-4b90-9769-fcb4a38c477c" }, status: 0 });
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async search(status: number, start: Date, end: Date, domainName: string, UserId: string, NameId: string, sort: string) {
        try {
            const user = await User.findById(UserId);
            const role = await Role.findOne({ Name: "Admin" });
            let monObjet: { [key: string]: any } = {};
            let sortobj: any;
            if (status) { monObjet.status = { status: status } }
            monObjet.AppId = { $ne: "d092530a-1386-4b90-9769-fcb4a38c477c" };
            if (NameId) {
                monObjet.$or = [
                    { DomainName: { $regex: new RegExp(NameId, 'i') } },
                    { AppId: { $regex: new RegExp(NameId, 'i') } },
                ]
            }
            if (user.Role !== role._id) {
                monObjet.authors = new mongoose.Types.ObjectId(UserId);
            }
            if (start && end) {
                monObjet.createdAt = { $gt: start, $lt: end };
            } else {
                start && (monObjet.createdAt = { $gt: start });
                end && (monObjet.createdAt = { $lt: end });
            }
            domainName && (monObjet.DomainName = { $regex: new RegExp(domainName, "i") })
            let valiny = await Application.find(monObjet).sort({ "DomainName": 1 }).populate("Categorie").populate("Platform");
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async getLogo(Name: string): Promise<string> {
        const imagePath = path.join('src/module/Logo/' + Name);
        return imagePath;
    }
}
export default new ApplicationService();
