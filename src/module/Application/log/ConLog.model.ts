import mongoose, { Document, Schema } from 'mongoose';

interface IConLog extends Document {
    Date: Date,
    CorLat: string,
    CorLong: string,
    system: string,
    device: string,
    IP: string,
    Browser: string,
    status: boolean,
    UserApplication: string
}
const ConLogShema = new Schema(
    {
        Date: { type: Date, required: true },
        CorLat: { type: String },
        CorLong: { type: String },
        system: { type: String },
        device: { type: String },
        IP: { type: String },
        Browser: { type: String },
        status: { type: Boolean },
        UserApplication: { type: Schema.Types.ObjectId, ref: 'UserApplication' },
    }
);
const ConLog = mongoose.model<IConLog>('ConLog', ConLogShema);
export default ConLog;