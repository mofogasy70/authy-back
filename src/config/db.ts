import mongoose from 'mongoose';
import { MONGODB_URI } from './constant';

const connectDB = async () => {
  try {
    const uri = MONGODB_URI as string; // Remplacez par votre URI MongoDB
    await mongoose.connect(uri);
    console.log('-> Connexion à MongoDB établie avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
};
export default connectDB;