import mongoose from "mongoose";
import Redirect from "./Redirect.model";

class RedirectService {
    async getRedirect() {
        try {
            const valiny = Redirect.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findRedirect(application: string) {
        try {
            const valiny = Redirect.find({Application:new mongoose.Types.ObjectId(application)});
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createRedirect(value: string,application:mongoose.Types.ObjectId) {
        try {
            const RedirectTemp = new Redirect({
                value,
                Application:application
            });
            return await RedirectTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteRedirect(id: String) {
        try {
            return await Redirect.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateRedirect(id: String, newData: object) {
        try {
            return await Redirect.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new RedirectService();
