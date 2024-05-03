import mongoose from "mongoose";
import Platform from "./Platform.model";

class PlatformService {
    async getPlatform() {
        try {
            const valiny = Platform.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findPlatform(application: string) {
        try {
            const valiny = Platform.findById(new mongoose.Types.ObjectId(application));
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createPlatform(Name: string) {
        try {
            const PlatformTemp = new Platform({
                Name,
            });
            return await PlatformTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deletePlatform(id: String) {
        try {
            return await Platform.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updatePlatform(id: String, newData: object) {
        try {
            return await Platform.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new PlatformService();
