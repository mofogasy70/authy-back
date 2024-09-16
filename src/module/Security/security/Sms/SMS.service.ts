import SMS from "./SMS.model";
import mongoose from "mongoose";
import UserAppSecurity from "../../../Application/application-serurity/UserAppSecurity.model";
import SecurityClass from "../../../../utilitaire/SecurityClass";
import UserAppSecurityChecks from "../../../Application/application-security-check/UserAppSecurityChecks.model";
import * as jwt from 'jsonwebtoken';
import User from "../../../Account/User/User.model";
import UserApplication from "../../../Application/application/UserApplication.model";
import { CODE_TOKEN, accountSid, authToken, twilioNum } from '../../../../config/constant';
interface IUserAppSecurityChecks extends Document {
    _id: mongoose.Types.ObjectId,
    Attemps: number,
    Retries: number,
    Code: string,
    Validate: Date,
    Blocage: Date,
    UserAppSecurity: string
}
interface IUserAppSecurity extends Document {
    _id: mongoose.Types.ObjectId,
    MaxAttemps: number,
    MaxRetries: number,
    ValidityTime: number,
    Status: boolean,
    UserApplication: string,
    Security: string
}
class SMSservice implements SecurityClass {
    async landingPage(UserApplications: string, Security: string): Promise<string> {
        const token = jwt.sign({ UserApplications: UserApplications, Security: Security },CODE_TOKEN, { expiresIn: '1h' });
        return "/Confirm/" + token;
    }
    async Redirect(): Promise<string> {
        return "/Acceuil"
    }
    async blockcheck(userAppSecurityChecks: IUserAppSecurityChecks): Promise<boolean> {
        try {
            if (userAppSecurityChecks.Blocage > new Date()) {
                throw new Error("sorry, you are still blocked for " + SecurityClass.differenceEnMinutesEtSecondes(new Date(), userAppSecurityChecks.Blocage));
            }
            else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
    async validitecheck(userAppSecurityChecks: IUserAppSecurityChecks): Promise<boolean> {
        try {
            if (userAppSecurityChecks.Validate < new Date()) {
                throw new Error("sorry, sorry, the code you want to check has expired " + SecurityClass.differenceEnMinutesEtSecondes(userAppSecurityChecks.Validate, new Date()) + " ago ,resend new");
            }
            else {
                return true;
            }
        } catch (error) {
            throw error;
        }
    }
    async Init(UserApplications_str: string): Promise<number> {
        try {
            const AleatoireNumber = await SecurityClass.genererNombreAleatoire(6);
            const userAppSecurity: IUserAppSecurity = await UserAppSecurity.findOne({ UserApplication: new mongoose.Types.ObjectId(UserApplications_str), Status: true });
            const userAppSecurityChecks: IUserAppSecurityChecks = await UserAppSecurityChecks.findOne({ UserAppSecurity: userAppSecurity._id });
            await this.blockcheck(userAppSecurityChecks);
            try {
                const userApplication = await UserApplication.findById(UserApplications_str);
                const user = await User.findById(userApplication.User);
                await this.SMSsendcode(user.PhoneNumber, AleatoireNumber.toString());
            } catch (error) {
                throw error;
            }
            return await this.AddRetries(AleatoireNumber, userAppSecurity, userAppSecurityChecks);
        } catch (error) {
            throw error;
        }
    }
    async Check(UserApplications: string, object: Object): Promise<boolean> {
        try {
            const userAppSecurity: IUserAppSecurity = await UserAppSecurity.findOne({ UserApplication: new mongoose.Types.ObjectId(UserApplications), Status: true });
            const userAppSecurityChecks: IUserAppSecurityChecks = await UserAppSecurityChecks.findOne({ UserAppSecurity: userAppSecurity._id });
            await this.blockcheck(userAppSecurityChecks);
            await this.validitecheck(userAppSecurityChecks);
            if (userAppSecurityChecks.Code === object) {
                await UserAppSecurityChecks.findByIdAndUpdate(
                    userAppSecurityChecks._id,
                    {
                        Attemps: 0,
                        Retries: 0,
                    },
                    { new: true }
                );
                return true;
            }
            else {
                if (userAppSecurityChecks.Attemps > userAppSecurity.MaxAttemps - 1) {
                    let blocage = new Date();
                    blocage.setMinutes(blocage.getMinutes() + 10);
                    let userAppSecurityChecksT = await UserAppSecurityChecks.findByIdAndUpdate(
                        userAppSecurityChecks._id,
                        {
                            Attemps: 0,
                            Blocage: blocage,
                        },
                        { new: true }
                    );
                    throw new Error("maximun of Attemps is " + userAppSecurity.MaxAttemps + " you are block for " + SecurityClass.differenceEnMinutesEtSecondes(new Date(), blocage) + "");
                } else {
                    let userAppSecurityChecksT = await UserAppSecurityChecks.findByIdAndUpdate(
                        userAppSecurityChecks._id,
                        {
                            Attemps: userAppSecurityChecks.Attemps + 1
                        },
                        { new: true }
                    );
                    throw new Error("the code you typed is incorrect, you have " + (userAppSecurity.MaxAttemps - userAppSecurityChecksT.Attemps) + " attempts left");
                }
            }
        } catch (error) {
            throw error;
        }
    }
    async AddRetries(object: Object, userAppSecurity: IUserAppSecurity, userAppSecurityChecks: IUserAppSecurityChecks): Promise<number> {
        try {
            let blocage = new Date();
            let validite = new Date();
            blocage.setSeconds(blocage.getSeconds() - 1);
            validite.setSeconds(validite.getSeconds() + userAppSecurity.ValidityTime * 60);
            if (userAppSecurityChecks.Retries > userAppSecurity.MaxRetries - 1) {
                blocage = new Date();
                blocage.setMinutes(blocage.getMinutes() + 10);
                await UserAppSecurityChecks.findByIdAndUpdate(
                    userAppSecurityChecks._id,
                    {
                        Code: object.toString(),
                        Validate: validite,
                        Blocage: blocage,
                        Retries: 0
                    },
                    { new: true }
                );
                throw new Error("maximun of Retries is " + userAppSecurity.MaxRetries + " you are block for " + SecurityClass.differenceEnMinutesEtSecondes(new Date(), blocage) + "");
            }
            else {

                let userAppSecurityChecksT = await UserAppSecurityChecks.findByIdAndUpdate(
                    userAppSecurityChecks._id,
                    {
                        Code: object.toString(),
                        Validate: validite,
                        Blocage: blocage,
                        Retries: userAppSecurityChecks.Retries + 1
                    },
                    { new: true }
                );
                return userAppSecurity.MaxAttemps - userAppSecurityChecksT.Retries;
            }
        } catch (error) {
            throw error;
        }
    }
    async SMSsendcode(Numero: string, Code: string) {
        try {
            const sms = new SMS(`${accountSid}`, `${authToken}`, `${twilioNum}`);
            const valiny = await sms.sendSms(SMS.tobody(Code), Numero);
            return valiny;
        } catch (error) {
            throw error;
        }
        return null;
    }
}
export default new SMSservice();