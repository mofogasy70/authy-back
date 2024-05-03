import mongoose from "mongoose";
interface IUserAppSecurityChecks extends Document {
    _id: mongoose.Types.ObjectId
    Attemps: number,
    Retries: number,
    Code: string,
    Validate: Date,
    Blocage: Date,
    UserAppSecurity: string
}
interface IUserAppSecurity extends Document {
    MaxAttemps: number,
    MaxRetries: number,
    ValidityTime: number,
    Status: boolean,
    UserApplication: string,
    Security: string
}
abstract class SecurityClass {
    abstract Init(UserApplications: string): Promise<number>;
    abstract Check(UserApplications: string,object:Object): Promise<boolean>;
    abstract AddRetries(object: Object, userAppSecurity: IUserAppSecurity, userAppSecurityChecks: IUserAppSecurityChecks): Promise<number>;
    abstract blockcheck(userAppSecurityChecks: IUserAppSecurityChecks): Promise<boolean>;
    abstract validitecheck(userAppSecurityChecks: IUserAppSecurityChecks): Promise<boolean>;
    abstract landingPage(UserApplications: string,Security:string):Promise<string>;
    abstract Redirect():Promise<string>;

    public static genererNombreAleatoire(longueur: number): number {
        const min = Math.pow(10, longueur - 1); // Le nombre minimum a `longueur` chiffres
        const max = Math.pow(10, longueur) - 1; // Le nombre maximum a `longueur` chiffres

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public static differenceEnMinutesEtSecondes(date1: Date, date2: Date): string {
        const differenceEnMillisecondes = Math.abs(date2.getTime() - date1.getTime());
        const minutes = Math.floor(differenceEnMillisecondes / (1000 * 60));
        const secondes = Math.floor((differenceEnMillisecondes % (1000 * 60)) / 1000);
        return `${minutes.toString().padStart(2, '0')} minute ${secondes.toString().padStart(2, '0')} second`;
    }

}
export default SecurityClass;