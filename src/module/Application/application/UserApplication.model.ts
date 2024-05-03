import mongoose, { Document, Schema } from 'mongoose';

interface IUserApplication extends Document {
    Application: String,
    User: String,
}
const UserApplicationSchema = new Schema(
    {
        Application: { type: Schema.Types.ObjectId, ref: 'Application' },
        User:{ type: Schema.Types.ObjectId, ref: 'User' }
    }
);
const UserApplication = mongoose.model<IUserApplication>('UserApplication', UserApplicationSchema);
export default UserApplication;