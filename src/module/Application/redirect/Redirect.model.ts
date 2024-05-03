import mongoose, { Document, Schema } from 'mongoose';

interface IRedirect extends Document {
    Application: string,
    value:string
}
const RedirectShema = new Schema(
    {
        value: { type: String, required: true },
        Application: { type: Schema.Types.ObjectId, ref: 'Application' },
    }
);
const Redirect = mongoose.model<IRedirect>('Redirect', RedirectShema);
export default Redirect;