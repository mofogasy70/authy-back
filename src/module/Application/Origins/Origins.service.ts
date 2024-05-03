import mongoose from "mongoose";
import Origins from "./Origins.model";

class OriginsService {
    async getOrigins() {
        try {
            const valiny = Origins.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findOrigins(application: string) {
        try {
            const valiny = Origins.find({Application:new mongoose.Types.ObjectId(application)});
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createOrigins(value: string,application:mongoose.Types.ObjectId) {
        try {
            const OriginsTemp = new Origins({
                value,
                Application:application
            });
            return await OriginsTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteOrigins(id: String) {
        try {
            return await Origins.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateOrigins(id: String, newData: object) {
        try {
            return await Origins.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new OriginsService();
