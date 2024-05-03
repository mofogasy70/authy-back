import mongoose, { Document, Schema } from 'mongoose';

interface IUserAppSecurityChecks extends Document {
    Attemps: number,
    Retries: number,
    Code:string,
    Validate:Date,
    Blocage:Date,
    UserAppSecurity:string
}
const UserAppSecurityChecksShema = new Schema(
    {
        Attemps: { type: Number, required: true },
        Retries: { type: Number, required: true },
        Code: { type: String, required: true },
        Validate: { type: Date, required: true },
        Blocage: { type: Date, required: true },
        UserAppSecurity: { type: Schema.Types.ObjectId, ref: 'UserAppSecurity' },
    }
);
const UserAppSecurityChecks = mongoose.model<IUserAppSecurityChecks>('UserAppSecurityChecks', UserAppSecurityChecksShema);
export default UserAppSecurityChecks;