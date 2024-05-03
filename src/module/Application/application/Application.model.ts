import mongoose, { Document, Schema } from 'mongoose';

interface IApplication extends Document {
    DomainName: string,
    AppId: string,
    Uri: string,
    UriRedirection: string,
    Logo: string,
    createdAt: Date,
    status: number,
    securityStatus: number,
    AppKey: string,
    Platform: mongoose.Types.ObjectId,
    Categorie:mongoose.Types.ObjectId,
    authors:mongoose.Types.ObjectId,

}
const ApplicationShema = new Schema(
    {
        DomainName: { type: String, required: true },
        AppId: { type: String, required: true },
        AppKey: { type: String, required: true },
        Uri: { type: String, required: true },
        UriRedirection: { type: String, required: true },
        status: { type: Number, required: true },
        securityStatus: { type: Number, required: true },
        Logo: { type: String },
        createdAt: { type: Date, required: true },
        Platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
        Categorie: { type: Schema.Types.ObjectId, ref: 'Categorie' },
        authors: { type: Schema.Types.ObjectId, ref: 'User' }
    }
);
const Application = mongoose.model<IApplication>('Application', ApplicationShema);
export default Application;