import mongoose, { Document, Schema } from 'mongoose';

interface IDevice extends Document {
    system: string,
    version: string,
    platform: string,

    deviceType: string,
    deviceBrand: string,
    deviceModel: string,

    User: string
    IP: string,
    status: number
}
const DeviceShema = new Schema(
    {
        system: { type: String },
        version: { type: String },
        platform: { type: String },

        deviceType: { type: String },
        deviceBrand: { type: String },
        deviceModel: { type: String },

        status: { type: Number },
        IP: { type: String },
        User: { type: Schema.Types.ObjectId, ref: 'User' },
    }
);
const Device = mongoose.model<IDevice>('Device', DeviceShema);
export default Device;