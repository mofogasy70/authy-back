import mongoose, { Document, Schema } from 'mongoose';

interface ITypeSecurity extends Document {
    Name: string,
    Description:string
}
const TypeSecurityShema = new Schema(
    {
        Name: { type: String, required: true },
        Description: { type: String }
    }
);
const TypeSecurity = mongoose.model<ITypeSecurity>('TypeSecurity', TypeSecurityShema);
export default TypeSecurity;