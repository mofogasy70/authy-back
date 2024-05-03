import mongoose, { Document, Schema } from 'mongoose';

interface ISecurity extends Document {
    Name: string,
    TypeSecurity:string
}
const SecurityShema = new Schema(
    {
        Name: { type: String, required: true },
        TypeSecurity: { type: Schema.Types.ObjectId, ref: 'TypeSecurity' }
    }
);
const Security = mongoose.model<ISecurity>('Security', SecurityShema);
export default Security;