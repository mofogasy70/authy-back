import mongoose, { Document, Schema } from 'mongoose';

interface IToken extends Document {
    Value: String, 
    User: String, 
    UserApplication:string
}
const TokenShema = new Schema(
    {
        Value: { type: String, required: true },
        User: { type: String,required:true },
        UserApplication: { type: String}
    }
);
const Token = mongoose.model<IToken>('Token', TokenShema);
export default Token;