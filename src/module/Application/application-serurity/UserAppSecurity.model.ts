import mongoose, { Document, Schema } from 'mongoose';

interface IUserAppSecurity extends Document {
    MaxAttemps: number,
    MaxRetries: number,
    ValidityTime: number,
    Status: boolean,
    UserApplication: string,
    Security: string
}
const UserAppSecurityShema = new Schema(
    {
        MaxAttemps: { type: Number, required: true },
        MaxRetries: { type: Number, required: true },
        ValidityTime: { type: Number, required: true },
        Status: { type: Boolean, required: true },
        UserApplication: { type: Schema.Types.ObjectId, ref: 'UserApplication' },
        Security: { type: Schema.Types.ObjectId, ref: 'Security' }
    }
);
const UserAppSecurity = mongoose.model<IUserAppSecurity>('UserAppSecurity', UserAppSecurityShema);
export default UserAppSecurity;