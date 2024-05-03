
import * as jwt from 'jsonwebtoken';
import path from "path";
import mongoose from "mongoose";
import User from './User.model';
import TokenServices from '../../Security/Token/Token.services';
import UserApplicationService from '../../Application/application/UserApplication.service';
import Token from '../../Security/Token/Token.model';
import UserAppSecurity from '../../Application/application-serurity/UserAppSecurity.model';
import UserApplication from '../../Application/application/UserApplication.model';
import ConLogService from '../../Application/log/ConLog.service';
import UserAppSecurityService from '../../Application/application-serurity/UserAppSecurity.service';
import SecurityClass from '../../../utilitaire/SecurityClass';
import SecurityService from '../../Security/security/Security.service';
import Role from '../Role/Role.model';
import Application from '../../Application/application/Application.model';
import ActivityService from '../../Application/activity/Activity.service';
import Stripe from "stripe";
import UserAppSecurityChecksService from '../../Application/application-security-check/UserAppSecurityChecks.service';
interface AuthenticationResponse {
    isurl: boolean;
    istoken: boolean;
    url: string;
    token: any
}
interface signinResponse {
    isurl: boolean;
    istoken: boolean;
    url: string;
    token: any;
    navigate: boolean;
}
interface SecurityElements {
    _id: mongoose.Types.ObjectId;
    class: SecurityClass
}
class UserService {
    async getUsers() {
        try {
            const valiny = await User.find().populate("Role").exec();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async FindUsersById(_id: string) {
        try {
            const valiny = await User.findById(_id).populate("Role").exec();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createUsers(Name: String, LastName: String, DateBirth: Date, Address: String, PhoneNumber: String, Password: String, Role: String, Mail: string) {
        try {
            const UserTemp = new User({
                Name, LastName, DateBirth, Address, PhoneNumber, Password, Role, Mail
            });
            return await UserTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createUsers_2(Name: String, LastName: String, DateBirth: Date, Address: String, PhoneNumber: String, Password: String, Mail: string, Avatar: string) {
        const role = await Role.findOne({ Name: "Users" });
        try {
            if (role) {
                const UserTemp = new User({
                    Name, LastName, DateBirth, Address, PhoneNumber, Password, Role: role._id, Mail, Avatar
                });
                const Usercreate = await UserTemp.save();
                const UserAppcreate = await UserApplicationService.createUserApplications("6519767f6e29ff41fcdd4d35", Usercreate._id);
                const UserAppSecurity = await UserAppSecurityService.createCleanUserAppSecurity((UserAppcreate)._id);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUsers(id: String) {
        return await User.findByIdAndDelete(id);
    }
    async updateUsers(id: String, newData: Object) {
        return await User.findByIdAndUpdate(id, newData, { new: true });
    }
    async Authentication(Mail: String, Password: String, info: any, ip: string) {
        let valiny: AuthenticationResponse;
        try {
            const userApplication = await this.verifUser(Mail, Password, info,"d092530a-1386-4b90-9769-fcb4a38c477c", ip,false);
            const userAppSecurity = await UserAppSecurity.findOne({ UserApplication: userApplication._id, Status: true });
            if (userAppSecurity) {
                const LSecurityElements = SecurityService.getListeSecurity();
                for (let index = 0; index < LSecurityElements.length; index++) {
                    if (new mongoose.Types.ObjectId(userAppSecurity.Security).toString() === LSecurityElements[index]._id.toString()) {
                        valiny = {
                            isurl: true,
                            istoken: false,
                            url: await LSecurityElements[index].class.landingPage(userApplication._id, userAppSecurity.Security),
                            token: null
                        }
                        console.log(valiny);
                    }
                }
            }
            else {
                const user:any = await User.findOne({_id:userApplication.User}).populate("Role").exec();
                const application = await Application.findById(userApplication.Application);
                const token = jwt.sign({ UserId: user._id, Role: user.Role.Name, UserApplication: userApplication._id }, 'Zr7$tpL9#qXquelzal', { expiresIn: '1h' });
                await TokenServices.createTokens(token, user._id, "test");
                valiny = {
                    isurl: false,
                    istoken: true,
                    url: null,
                    token: token
                };
            }
            return valiny;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async verifUser(Mail: String, Password: String, info: any, AppId: String, ip: string,create:boolean) {
        try {
            const user = await User.findOne({ Mail: Mail });
            if (user) {
                const application = await Application.findOne({ AppId: AppId });
                const userApplication = await UserApplication.findOne({ User: user._id, Application: application._id });
                if (userApplication) {
                    if (user.Password === Password) {
                        await ConLogService.createConLogs(
                            info.coord.latitude,
                            info.coord.longitude,
                            info.device.os.name,
                            info.device.device.type,
                            ip,
                            info.device.client.name,
                            userApplication._id,
                            true
                        );
                        return userApplication;
                    }
                    else {
                        await ConLogService.createConLogs(
                            info.coord.latitude,
                            info.coord.longitude,
                            info.device.os.name,
                            info.device.device.type,
                            ip,
                            info.device.client.name,
                            userApplication._id,
                            false
                        );
                        throw new Error("wrong Password")
                    }
                } else {
                    if (create) {
                        const userApplication=await UserApplicationService.createUserApplications(application._id,user._id);
                        const userAppSecurity=await UserAppSecurityService.createCleanUserAppSecurity(userApplication._id);
                        return userApplication;
                    }
                }
            }
            else {
                throw new Error("this user doesn't not exist,please create account");
            }
        } catch (error) {
            throw error;
        }


    }
    async Authentication_2(Mail: String, Password: String, info: any, AppId: string, ip: string) {
        let valiny: signinResponse;
        try {

            const userApplication = await this.verifUser(Mail, Password, info, AppId, ip,true);
            const userAppSecurity = await UserAppSecurity.findOne({ UserApplication: userApplication._id, Status: true });
            if (userAppSecurity) {
                const LSecurityElements = SecurityService.getListeSecurity();
                for (let index = 0; index < LSecurityElements.length; index++) {
                    if (new mongoose.Types.ObjectId(userAppSecurity.Security).toString() === LSecurityElements[index]._id.toString()) {
                        const url = await LSecurityElements[index].class.landingPage(userApplication._id, userAppSecurity.Security);
                        valiny = {
                            isurl: true,
                            istoken: false,
                            url: url,
                            token: null,
                            navigate: true
                        }
                    }
                }
            }
            else {
                const user = await User.findById(userApplication.User);
                const application = await Application.findById(userApplication.Application);
                const token = jwt.sign({ UserId: user._id, Mail: user.Mail }, 'Zr7$tpL9#qXquelzal', { expiresIn: '1h' });
                valiny = {
                    isurl: true,
                    istoken: true,
                    url: application.UriRedirection + "?accesstoken=" + token,
                    token: token,
                    navigate: false
                };
            }
            return valiny;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkToken(token: string): Promise<boolean> {
        try {
            let valiny = false;
            const tokenBase = await Token.findOne({ Value: token });
            if (tokenBase) {
                jwt.verify(token, 'Zr7$tpL9#qXquelzal', (err, decoded) => {
                    if (err) {
                        throw err;
                    } else {
                        valiny = true;
                    }
                });
            }
            else {
                throw new Error("database doesn't not containt this token");
            }
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async updateName(id: String, Name: String) {
        try {
            return await this.updateUsers(id, { Name: Name }).then(async (response) => {
                const userApplication = await UserApplication.findOne({ User: id });
                await ActivityService.createActivitys(2, 'You update your name as ' + response.Name, new Date(), '/PersonnalData', userApplication._id);
            });
        } catch (error) {
            throw error;
        }
    }
    async updateLastName(id: String, LastName: String) {
        try {
            return await this.updateUsers(id, { LastName: LastName }).then(async (response) => {
                const userApplication = await UserApplication.findOne({ User: id });
                await ActivityService.createActivitys(2, 'You update your Last Name as ' + response.LastName, new Date(), '/PersonnalData', userApplication._id);
            });
        } catch (error) {
            throw error;
        }
    }
    async updateDateBirth(id: String, DateBirth: String) {
        try {
            return await this.updateUsers(id, { DateBirth: DateBirth }).then(async (response) => {
                const userApplication = await UserApplication.findOne({ User: id });
                await ActivityService.createActivitys(2, 'You update your Date Birth as ' + response.DateBirth, new Date(), '/PersonnalData', userApplication._id);
            });
        } catch (error) {
            throw error;
        }
    }
    async updateAddress(id: String, Address: String) {
        try {
            return await this.updateUsers(id, { Address: Address }).then(async (response) => {
                const userApplication = await UserApplication.findOne({ User: id });
                await ActivityService.createActivitys(2, 'You update your Address as ' + response.Address, new Date(), '/PersonnalData', userApplication._id);
            });
        } catch (error) {
            throw error;
        }
    }
    async updatePhoneNumber(id: String, PhoneNumber: String) {
        try {
            return await this.updateUsers(id, { PhoneNumber: PhoneNumber }).then(async (response) => {
                const userApplication = await UserApplication.findOne({ User: id });
                await ActivityService.createActivitys(3, 'You update your PhoneNumber as ' + response.PhoneNumber + ' and you may verify it', new Date(), '/PersonnalData', userApplication._id);
            });
        } catch (error) {
            throw error;
        }
    }
    async getclient() {
        try {
            const role = await Role.findOne({ Name: "Users" });
            const user = await User.find({ Role: role._id }).populate('Role').exec();
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getAdmin() {
        try {
            const role = await Role.findOne({ Name: "Admin" });
            const user = await User.find({ Role: role._id }).populate('Role').exec();
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getDev() {
        try {
            const role = await Role.findOne({ Name: "Dev" });
            const user = await User.find({ Role: role._id }).populate('Role').exec();
            return user;
        } catch (error) {
            throw error;
        }
    }
    async exchangeToken(token: string): Promise<boolean> {
        try {
            let dataUser;
            await jwt.verify(token, 'Zr7$tpL9#qXquelzal', async (err, decoded: any) => {
                if (err) {
                    throw err;
                } else {
                    const user = await User.findById(decoded.UserId);
                    dataUser = {
                        _id: user._id,
                        Name: user.Name,
                        LastName: user.LastName,
                        Mail: user.Mail,
                        Avatar: user.Avatar,
                        DateBirth: user.DateBirth,
                    }
                }
            });
            return dataUser;
        } catch (error) {
            throw error;
        }
    }
    async getAvatar(Name: string): Promise<string> {
        const imagePath = path.join('src/module/avatar/' + Name);
        return imagePath;
    }

}
export default new UserService();
