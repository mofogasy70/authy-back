import mongoose from "mongoose";
import Security from "./Security.model";
import SMSService from "./Sms/SMS.service";
import MailService from "./Mail/Mail.service";
import SecurityClass from "../../../utilitaire/SecurityClass";
interface SecurityElements {
    _id: mongoose.Types.ObjectId;
    class: SecurityClass
}
class SecurityService {
    async getSecuritys() {
        try {
            const valiny = Security.find().populate("TypeSecurity").exec();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createSecuritys(Name: string, TypeSecurity: string) {
        try {
            const SecurityTemp = new Security({
                Name,
                TypeSecurity
            });
            return await SecurityTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteSecuritys(id: String) {
        try {
            return await Security.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateSecuritys(id: String, newData: object) {
        try {
            return await Security.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    getListeSecurity(): SecurityElements[] {
        const valiny: SecurityElements[] = [
            {
                _id: new mongoose.Types.ObjectId("6517d4d716cb0c2d01fa9fdd"),
                class: SMSService
            },
            {
                _id: new mongoose.Types.ObjectId("6517d4e916cb0c2d01fa9fe5"),
                class: MailService
            }
        ];
        return valiny;
    }
}
export default new SecurityService();
