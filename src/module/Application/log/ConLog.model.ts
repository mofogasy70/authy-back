import mongoose, { Document, Schema } from 'mongoose';

interface IConLog extends Document {
    Date: Date,
    CorLat: string,
    CorLong: string,

    BrowserName: string,
    BrowserType: string,
    BrowserVersion: string,
    BrowserEngine: string,

    status: boolean,
    device: string,
    UserApplication: string
    reason:string
}
const ConLogShema = new Schema(
    {
        Date: { type: Date, required: true },
        CorLat: { type: String },
        CorLong: { type: String },

        BrowserName: { type: String },
        BrowserType: { type: String },
        BrowserVersion: { type: String },
        BrowserEngine: { type: String },

        status: { type: Boolean },
        reason: { type: String },
        UserApplication: { type: Schema.Types.ObjectId, ref: 'UserApplication' },
        device: { type: Schema.Types.ObjectId, ref: 'device' },
    }
);
const ConLog = mongoose.model<IConLog>('ConLog', ConLogShema);
export default ConLog;