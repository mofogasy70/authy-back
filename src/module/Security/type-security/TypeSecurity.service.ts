import Application from "../../Application/application/Application.model";
import UserAppSecurity from "../../Application/application-serurity/UserAppSecurity.model";
import UserApplicationService from "../../Application/application/UserApplication.service";
import Security from "../security/Security.model";
import TypeSecurity from "./TypeSecurity.model";

interface ITypeSecurity {
    _id: string;
    Name: string;
    Description: string;
}
interface ITypeSecuritysWithChild {
    TypeSecurity?: ITypeSecurity;
    UserAppSecurity?: IUserAppSecurity[];
}
interface IUserAppSecurity {
    MaxAttemps: number;
    MaxRetries: number;
    ValidityTime: number;
    Status: boolean;
    UserApplication: string;
    Security: any;
}
class TypeSecurityService {

    async getTypeSecuritys() {
        try {
            const valiny = TypeSecurity.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createTypeSecuritys(Name: string, Description: string) {
        try {
            const TypeSecurityTemp = new TypeSecurity({
                Name,
                Description
            });
            return await TypeSecurityTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteTypeSecuritys(id: String) {
        try {
            return await TypeSecurity.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateTypeSecuritys(id: String, newData: object) {
        try {
            return await TypeSecurity.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async FindTypeSecuritysWithChild(application:string,user:string): Promise<ITypeSecuritysWithChild[]> {
        try {
            if (!application) {
                application=(await Application.findOne({DomainName:"Authy"}))?._id;
            }
            const userApplication=await UserApplicationService.findUserApplication(application,user);
            let LTypeSecuritysWithChild: ITypeSecuritysWithChild[] = [];
            let LTypeSecurity = await TypeSecurity.find();

            for (const TypeSecurity of LTypeSecurity) {
                let TypeSecuritysWithChild: ITypeSecuritysWithChild = {};
                TypeSecuritysWithChild.TypeSecurity = TypeSecurity;
                TypeSecuritysWithChild.UserAppSecurity=[];
                let LSecurity = await Security.find({ TypeSecurity: TypeSecurity._id });
                for(const Security of LSecurity){
                    let LUserAppSecurity=await UserAppSecurity.find({UserApplication:userApplication?._id,Security:Security._id}).populate("Security").exec();
                    for(const UserAppSecurity of LUserAppSecurity){
                        TypeSecuritysWithChild.UserAppSecurity.push(UserAppSecurity);  
                    }
                }
                LTypeSecuritysWithChild.push(TypeSecuritysWithChild);
            }
            return LTypeSecuritysWithChild;
        } catch (error) {
            throw error;
        }
    }  
}
export default new TypeSecurityService();
