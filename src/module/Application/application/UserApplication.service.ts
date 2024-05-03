import mongoose from "mongoose";
import Application from "./Application.model";
import UserApplication from "./UserApplication.model";

class UserApplicationService {
    async getUserApplications() {
        try {
            const valiny =await UserApplication.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findAppByUserId(_id:string) {
        try {
            const authy=await Application.findOne({AppId:'d092530a-1386-4b90-9769-fcb4a38c477c'});
            const valiny =await UserApplication.find({User:_id,'Application':{$ne:authy?._id}}).populate("Application").exec();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findUserApplication(application:string,user:string) {
        try {
            const valiny = await UserApplication.findOne({Application:new mongoose.Types.ObjectId(application),User:new mongoose.Types.ObjectId(user)});
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createUserApplications(Application: String,User:string) {
        try {
            const UserApplicationTemp = new UserApplication({
                Application,
                User
            });
            return await UserApplicationTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUserApplications(id: String) {
        try {
            return await UserApplication.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateUserApplications(id: String, newData: object) {
        try {
            return await UserApplication.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new UserApplicationService();
