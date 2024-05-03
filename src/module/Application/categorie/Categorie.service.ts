import mongoose from "mongoose";
import Categorie from "./Categorie.model";

class CategorieService {
    async getCategorie() {
        try {
            const valiny = Categorie.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async findCategorie(application: string) {
        try {
            const valiny = Categorie.findById(new mongoose.Types.ObjectId(application));
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createCategorie(Name: string) {
        try {
            const CategorieTemp = new Categorie({
                Name,
            });
            return await CategorieTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteCategorie(id: String) {
        try {
            return await Categorie.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateCategorie(id: String, newData: object) {
        try {
            return await Categorie.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new CategorieService();
