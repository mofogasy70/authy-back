import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    Name: string,
    LastName: string,
    PhoneNumber: string,
    Mail: string,
    DateBirth: Date,
    Address: string,
    Password: string,
    Role: string,
    Avatar:string
}

const UserShema = new Schema(
    {
        Name: { type: String, required: true  },
        LastName: { type: String, required: true },
        PhoneNumber: { type: String, required: true },
        Mail: { type: String, required: true },
        DateBirth: { type: Date, required: true },
        Address: { type: String, required: true },
        Password: { type: String, required: true },
        Avatar: { type: String},
        Role: { type: Schema.Types.ObjectId, ref: 'Role' }
    }
);

const User = mongoose.model<IUser>('User', UserShema);
export default User;