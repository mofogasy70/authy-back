import mongoose, { Document, Schema } from 'mongoose';
interface IActivity extends Document {
    status: number,
    description: string,
    date: Date,
    routes: string
    UserApplication:mongoose.Types.ObjectId
}
const ActivityShema = new Schema(
    {
        status: { type: Number, required: true },
        routes: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        UserApplication: { type: Schema.Types.ObjectId, ref: 'UserApplication' }
    }
);
const Activity = mongoose.model<IActivity>('Activity', ActivityShema);
export default Activity;