import mongoose, { Document, Schema } from 'mongoose';

interface ICategorie extends Document {
    Name: string,
}
const CategorieShema = new Schema(
    {
        Name: { type: String, required: true },
    }
);
const Categorie = mongoose.model<ICategorie>('Categorie', CategorieShema);
export default Categorie;