import mongoose from "mongoose";
import UserAppSecurityChecks from "./UserAppSecurityChecks.model";
import UserApplication from "../application/UserApplication.model";
import * as jwt from 'jsonwebtoken';
import TokenServices from "../../Security/Token/Token.services";
import SecurityService from "../../Security/security/Security.service";
import User from "../../Account/User/User.model";
import Application from "../application/Application.model";
import { CODE_TOKEN } from "../../../config/constant";
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
class UserAppSecurityChecksService {
    async getUserAppSecurityCheckss() {
        try {
            const valiny = UserAppSecurityChecks.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createUserAppSecurityCheckss(Attemps: number, Retries: number, Code: string, Validate: Date, Blocage: Date, UserAppSecurity: string) {
        try {
            const UserAppSecurityChecksTemp = new UserAppSecurityChecks({
                Attemps,
                Retries,
                Code,
                Validate,
                Blocage,
                UserAppSecurity
            });
            return await UserAppSecurityChecksTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createCleanUserAppSecurityCheckss(UserAppSecurity: string) {
        try {
            const UserAppSecurityChecksTemp = new UserAppSecurityChecks({
                Attemps: 0,
                Retries: 0,
                Code: "test",
                Validate: new Date(),
                Blocage: new Date(),
                UserAppSecurity
            });
            return await UserAppSecurityChecksTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUserAppSecurityCheckss(id: String) {
        try {
            return await UserAppSecurityChecks.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateUserAppSecurityCheckss(id: String, newData: object) {
        try {
            return await UserAppSecurityChecks.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async Init(UserApplications: string, Security: string) {
        try {
            const LSecurityElements = SecurityService.getListeSecurity();
            for (let index = 0; index < LSecurityElements.length; index++) {
                if (new mongoose.Types.ObjectId(Security).toString() === LSecurityElements[index]._id.toString()) {
                    return await LSecurityElements[index].class.Init(UserApplications);
                }
            }
        } catch (error) {
            throw error;
        }
    }
    async Check(UserApplicationstr: string, Security: string, object: Object, UriRedirection: string, type: number): Promise<signinResponse> {
        try {
            const LSecurityElements = SecurityService.getListeSecurity();
            for (let index = 0; index < LSecurityElements.length; index++) {
                if (new mongoose.Types.ObjectId(Security).toString() === LSecurityElements[index]._id.toString()) {
                    const temp: boolean = await LSecurityElements[index].class.Check(UserApplicationstr, object);
                    const redirect = await LSecurityElements[index].class.Redirect();
                    if (temp) {
                        const userApplications = await UserApplication.findById(UserApplicationstr);
                        const application = await Application.findById(userApplications.Application);
                        const user: any = await User.findById(userApplications.User).populate("Role").exec();
                        if (application.AppId === "d092530a-1386-4b90-9769-fcb4a38c477c") {
                            const token = jwt.sign({ UserId: user._id, Role: user.Role.Name, LastName: user.LastName, Avatar: user.Avatar, UserApplication: userApplications._id }, CODE_TOKEN, { expiresIn: '24h' });
                            await TokenServices.createTokens(token, user._id, "test");
                            return {
                                isurl: true,
                                istoken: false,
                                url: null,
                                accessToken: token,
                                refreshToken: null,
                                navigate: true
                            }
                        }
                        if (application.AppId !== "d092530a-1386-4b90-9769-fcb4a38c477c") {
                            const refreshToken = jwt.sign({}, CODE_TOKEN, { expiresIn: '30d' });
                            const refreshTokenBase = await TokenServices.createTokens(refreshToken, user._id, UserApplicationstr);
                            const accessToken = jwt.sign({ refreshToken: refreshTokenBase._id, }, CODE_TOKEN, { expiresIn: '1h' });
                            if (type === 1) {
                                return {
                                    isurl: true,
                                    istoken: false,
                                    url: application.UriRedirection.includes(UriRedirection) ? UriRedirection + `?accessToken=${accessToken}&refreshToken=${refreshToken}` : null,
                                    accessToken: null,
                                    refreshToken: null,
                                    navigate: false
                                };
                            }
                            else {
                                return {
                                    isurl: false,
                                    istoken: true,
                                    url: null,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    navigate: false
                                };
                            }
                        }
                    }
                }
            }
        } catch (error) {
            throw error;
        }

    }

}
export default new UserAppSecurityChecksService();
