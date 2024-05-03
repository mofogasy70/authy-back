import mongoose, { Document, Schema } from 'mongoose';

interface IRole extends Document {
    Name: String,
    Value:number
}
const RoleShema = new Schema(
    {
        Name: { type: String, required: true },
        Value: { type: String }
    }
);
const Role = mongoose.model<IRole>('Role', RoleShema);
export default Role;