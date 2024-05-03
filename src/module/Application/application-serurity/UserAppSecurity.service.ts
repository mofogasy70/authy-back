import UserAppSecurity from "./UserAppSecurity.model";
import SecurityService from "../../Security/security/Security.service";
import UserAppSecurityChecksService from "../application-security-check/UserAppSecurityChecks.service";

class UserAppSecurityService {
    async getUserAppSecuritys() {
        try {
            const valiny = UserAppSecurity.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createUserAppSecuritys(MaxAttemps: number, MaxRetries: number, ValidityTime: number, Status: boolean, UserApplication: string, Security: string) {
        try {
            const UserAppSecurityTemp = new UserAppSecurity({
                MaxAttemps,
                MaxRetries,
                ValidityTime,
                Status,
                UserApplication,
                Security
            });
            const valiny = await UserAppSecurityTemp.save();
            return await UserAppSecurityChecksService.createCleanUserAppSecurityCheckss(valiny._id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createCleanUserAppSecurity(UserApplication: string) {
        try {
            const LSecurity = await SecurityService.getSecuritys();
            for (const security of LSecurity) {
                const userAppSecurity= await this.createUserAppSecuritys(3, 3, 3, false, UserApplication, security._id);
                const userAppSecurityChecksService= await UserAppSecurityChecksService.createCleanUserAppSecurityCheckss(userAppSecurity._id);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async InitUserAppSecuritys(UserApplication: string) {
        try {
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUserAppSecuritys(id: String) {
        try {
            return await UserAppSecurity.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateUserAppSecuritys(id: String, newData: object) {
        try {
            return await UserAppSecurity.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async chageStatus(UserAppSecurity:string,status:boolean) {
        await this.updateUserAppSecuritys(UserAppSecurity,{Status:status});
    }
}
export default new UserAppSecurityService();
