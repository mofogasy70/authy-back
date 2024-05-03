import mongoose from "mongoose";
import Activity from "./Activity.model";
class ActivityService {
    async getActivitys() {
        try {
            const valiny = Activity.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createActivitys(status: number,description: string,date: Date,routes: string,UserApplication: mongoose.Types.ObjectId) {
        try {
            const ActivityTemp = new Activity({
                status:status,
                description:description,
                date:date,
                routes:routes,
                UserApplication:UserApplication
            });
            return await ActivityTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteActivitys(id: String) {
        try {
            return await Activity.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateActivitys(id: String, newData: object) {
        try {
            return await Activity.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async getActivitysUser(userApplication:string) {
        try {
            const valiny =await Activity.find({UserApplication:userApplication});
            return valiny;
        } catch (error) {
            throw error;
        }
    }
}
export default new ActivityService();
