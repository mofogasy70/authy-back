import mongoose, { Document, Schema } from 'mongoose';

interface IOrigins extends Document {
    Application: string,
    value:string
}
const OriginsShema = new Schema(
    {
        value: { type: String, required: true },
        Application: { type: Schema.Types.ObjectId, ref: 'Application' },
    }
);
const Origins = mongoose.model<IOrigins>('Origins', OriginsShema);
export default Origins;