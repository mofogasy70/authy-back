
import * as jwt from 'jsonwebtoken';
import path from "path";
import mongoose, { PipelineStage } from "mongoose";
import User from './User.model';
import TokenServices from '../../Security/Token/Token.services';
import UserApplicationService from '../../Application/application/UserApplication.service';
import Token from '../../Security/Token/Token.model';
import UserAppSecurity from '../../Application/application-serurity/UserAppSecurity.model';
import UserApplication from '../../Application/application/UserApplication.model';
import UserAppSecurityService from '../../Application/application-serurity/UserAppSecurity.service';
import SecurityClass from '../../../utilitaire/SecurityClass';
import SecurityService from '../../Security/security/Security.service';
import Role from '../Role/Role.model';
import Application from '../../Application/application/Application.model';
import ActivityService from '../../Application/activity/Activity.service';
import bcrypt from 'bcrypt';
import DeviceService from '../../Application/device/Device.service';
import Mail from '../../Security/security/Mail/Mail.model';
import { CODE_TOKEN } from '../../../config/constant';
import ConLog from '../../Application/log/ConLog.model';
import Device from '../../Application/device/Device.model';
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
    accessToken: any;
    refreshToken: any;
    navigate: boolean;
}
interface SecurityElements {
    _id: mongoose.Types.ObjectId;
    class: SecurityClass
}
interface infointerface {
    coord: { latitude: string, longitude: string },
    device: {
        client: {
            type: string,
            name: string,
            version: string,
            engine: string,
            engineVersion: string
        },
        os: { name: string, version: string, platform: string },
        device: { type: string, brand: string, model: string },
        bot: any
    }
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
        const saltRounds = 10;
        try {
            if (role) {
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    if (err) {
                        console.error('Erreur lors de la génération du sel :', err);
                    } else {
                        bcrypt.hash(Password, salt, async (err, hash) => {
                            if (err) {
                                console.error('Erreur lors du hachage du mot de passe :', err);
                            } else {
                                const UserTemp = new User({
                                    Name, LastName, DateBirth, Address, PhoneNumber, Password: hash, Role: role._id, Mail, Avatar
                                });
                                const Usercreate = await UserTemp.save();
                                const UserAppcreate = await UserApplicationService.createUserApplications("6519767f6e29ff41fcdd4d35", Usercreate._id);
                                const UserAppSecurity = await UserAppSecurityService.createCleanUserAppSecurity((UserAppcreate)._id);
                            }
                        });
                    }
                });
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
            const userApplication = await this.verifUser(Mail, Password, info, "d092530a-1386-4b90-9769-fcb4a38c477c", ip, false);
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
                    }
                }
            }
            else {
                const user: any = await User.findOne({ _id: userApplication.User }).populate("Role").exec();
                const token = jwt.sign({ UserId: user._id, Role: user.Role.Name, LastName: user.LastName, Avatar: user.Avatar, UserApplication: userApplication._id }, CODE_TOKEN, { expiresIn: '24h' });
                await TokenServices.createTokens(token, user._id, "test");
                valiny = {
                    isurl: false,
                    istoken: true,
                    url: null,
                    token: token
                };
            }
            console.log(valiny);
            return valiny;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async verifUser(Mail: String, Password: String, info: infointerface, AppId: String, ip: string, create: boolean) {
        try {
            const user = await User.findOne({ Mail: Mail });
            if (user) {
                const application = await Application.findOne({ AppId: AppId });
                const userApplication = await UserApplication.findOne({ User: user._id, Application: application._id });
                if (userApplication) {
                    const result = bcrypt.compareSync(Password, user.Password);
                    if (result) {
                        await DeviceService.verifDevice(info, ip, userApplication, true, null)
                        return userApplication;
                    }
                    else {
                        await DeviceService.verifDevice(info, ip, userApplication, false, "wrong Password")
                        throw new Error("wrong Password");
                    }
                } else {
                    if (create) {
                        const userApplication = await UserApplicationService.createUserApplications(application._id, user._id);
                        const userAppSecurity = await UserAppSecurityService.createCleanUserAppSecurity(userApplication._id);
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
    async Authentication_2(Mail: String, Password: String, info: any, AppId: string, ip: string, type: number, UriRedirection: string) {
        console.log(type);
        let valiny: signinResponse;
        try {
            const userApplication = await this.verifUser(Mail, Password, info, AppId, ip, true);
            const userAppSecurity = await UserAppSecurity.findOne({ UserApplication: userApplication._id, Status: true });
            if (userAppSecurity) {
                const LSecurityElements = SecurityService.getListeSecurity();
                for (let index = 0; index < LSecurityElements.length; index++) {
                    if (new mongoose.Types.ObjectId(userAppSecurity.Security).toString() === LSecurityElements[index]._id.toString()) {
                        const url = await LSecurityElements[index].class.landingPage(userApplication._id, userAppSecurity.Security);
                        valiny = {
                            isurl: true,
                            istoken: false,
                            url: url + `?type=${type}&UriRedirection=${UriRedirection}`,
                            accessToken: null,
                            refreshToken: null,
                            navigate: true
                        }
                    }
                }
            }
            else {
                const user = await User.findById(userApplication.User);
                const application = await Application.findById(userApplication.Application);
                const refreshToken = jwt.sign({}, CODE_TOKEN, { expiresIn: '30d' });
                const refreshTokenBase = await TokenServices.createTokens(refreshToken, user._id, userApplication._id);
                const accessToken = jwt.sign({ refreshToken: refreshTokenBase._id, }, CODE_TOKEN, { expiresIn: '1h' });
                if (type === 1) {
                    valiny = {
                        isurl: true,
                        istoken: false,
                        url: application.UriRedirection.includes(UriRedirection) ? UriRedirection + `?accessToken=${accessToken}&refreshToken=${refreshToken}` : null,
                        accessToken: null,
                        refreshToken: null,
                        navigate: false
                    };
                }
                else {
                    valiny = {
                        isurl: false,
                        istoken: true,
                        url: null,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        navigate: false
                    };
                }
            }
            console.log(valiny)
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
                jwt.verify(token, CODE_TOKEN, (err, decoded) => {
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
    async exchangeToken(token: string) {
        try {
            const decoded: any = jwt.verify(token, CODE_TOKEN);

            if (!decoded || !decoded.refreshToken) {
                throw new Error("Invalid token");
            }

            const t = await Token.findById(new mongoose.Types.ObjectId(decoded.refreshToken));
            if (!t) {
                throw new Error("This token has expired");
            }

            const u = await User.findById(t.User);
            if (!u) {
                throw new Error("User not found");
            }

            return {
                Name: u.Name,
                LastName: u.LastName,
                Avatar: "http://localhost:5000"+u.Avatar,
                userId: u._id,
                Mail: u.Mail,
            };
        } catch (error) {
            throw new Error(`Token exchange failed: ${error.message}`);
        }
    }

    async getAvatar(Name: string): Promise<string> {
        const imagePath = path.join('src/module/avatar/' + Name);
        return imagePath;
    }
    async ForgotPass(email: string) {
        try {
            const user = await User.findOne({ Mail: email });
            if (user) {
                const m = new Mail();
                const token = jwt.sign({ Mail: user.Mail, user: user._id }, CODE_TOKEN, { expiresIn: '1h' });
                await m.sendEmailForgotPass(email, "https://dev.authy.mg/resetPassword?token=" + token, user.LastName)
            }
            else {
                throw new Error("this user doesn't not exist,please create account")
            }
        } catch (error) {
            throw error
        }

    }
    async getUserByadmin(page: number, limit: number, role: string) {
        const r = await Role.find({ Name: role });
        try {
            const pipeline = [
                {
                    $match: {
                        Role: r[0]._id
                    }
                },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'Role',
                        foreignField: '_id',
                        as: 'user_role'
                    }
                },
                {
                    $skip: limit * (page - 1)
                },
                {
                    $limit: limit
                }
            ]
            const totalCount = await User.find({ Role: new mongoose.Types.ObjectId(r[0]._id) }).count();
            const valiny = await User.aggregate(pipeline);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                docs: valiny,
                metadata: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: totalCount,
                    nextPage: (page + 1) > totalPages ? 1 : page + 1,
                    prevPage: (page - 1) < 1 ? totalPages : page - 1
                }
            };
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async getdashboard(userId: string) {
        try {
            const pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: 'userapplications',
                        localField: 'UserApplication',
                        foreignField: '_id',
                        as: 'userapplication'
                    }
                },
                { $unwind: '$userapplication' },
                {
                    $match: {
                        "userapplication.User": new mongoose.Types.ObjectId(userId),
                        Date: {
                            $gte: new Date('2024-05-01T00:00:00.000Z'),
                            $lt: new Date('2024-08-01T00:00:00.000Z')
                        }
                    }
                },
                {
                    $count: 'totalResults'
                }
            ]
            const pipeline2: PipelineStage[] = [
                {
                    $lookup: {
                        from: 'userapplications',
                        localField: 'UserApplication',
                        foreignField: '_id',
                        as: 'userapplication'
                    }
                },
                { $unwind: '$userapplication' },
                {
                    $match: {
                        "userapplication.User": new mongoose.Types.ObjectId(userId),
                        Date: {
                            $gte: new Date('2024-05-01T00:00:00.000Z'),
                            $lt: new Date('2024-08-01T00:00:00.000Z')
                        },
                        status: false
                    }
                },
                {
                    $count: 'totalResults'
                }
            ]
            const response1 = await ConLog.aggregate(pipeline);
            const response2 = await ConLog.aggregate(pipeline2);
            const response3 = await UserApplicationService.getUserAppConformed(userId)
            const response4 = await Device.find({ User: new mongoose.Types.ObjectId(userId) }).count()
            return {
                requete: response1.length > 0 ? response1[0].totalResults : 0,
                erreur: response2.length > 0 ? response2[0].totalResults : 0,
                application: response3.length > 0 ? response3.length-1 : 0,
                device: response4
            };
        } catch (error) {
            throw error
        }
    }
    async getdashboarddev(userId: string) {
        try {
            const pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: 'userapplications',
                        localField: 'UserApplication',
                        foreignField: '_id',
                        as: 'userapplication'
                    }
                },
                { $unwind: '$userapplication' },
                {
                    $match: {
                        "userapplication.User": new mongoose.Types.ObjectId(userId),
                        Date: {
                            $gte: new Date('2024-05-01T00:00:00.000Z'),
                            $lt: new Date('2024-08-01T00:00:00.000Z')
                        }
                    }
                },
                {
                    $count: 'totalResults'
                }
            ]
            const pipeline2: PipelineStage[] = [
                {
                    $lookup: {
                        from: 'userapplications',
                        localField: 'UserApplication',
                        foreignField: '_id',
                        as: 'userapplication'
                    }
                },
                { $unwind: '$userapplication' },
                {
                    $match: {
                        "userapplication.User": new mongoose.Types.ObjectId(userId),
                        Date: {
                            $gte: new Date('2024-05-01T00:00:00.000Z'),
                            $lt: new Date('2024-08-01T00:00:00.000Z')
                        },
                        status: false
                    }
                },
                {
                    $count: 'totalResults'
                }
            ]
            const response1 = await ConLog.aggregate(pipeline);
            const response2 = await ConLog.aggregate(pipeline2);
            const response3 = await UserApplicationService.getUserAppConformed(userId)
            const response4 = await Device.find({ User: new mongoose.Types.ObjectId(userId) }).count()
            return {
                requete: response1.length > 0 ? response1[0].totalResults : 0,
                erreur: response2.length > 0 ? response2[0].totalResults : 0,
                application: response3.length > 0 ? response3.length : 0,
                device: response4
            };
        } catch (error) {
            throw error
        }
    }
}
export default new UserService();
