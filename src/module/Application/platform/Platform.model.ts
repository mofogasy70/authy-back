import mongoose, { Document, Schema } from 'mongoose';

interface IPlatform extends Document {
    Name: string,
}
const PlatformShema = new Schema(
    {
        Name: { type: String, required: true },
    }
);
const Platform = mongoose.model<IPlatform>('Platform', PlatformShema);
export default Platform;