// index.ts
import express from 'express';
import connectDB from './config/db';
import apiRouter from './routes/API.routes';
import cors from 'cors';
import authenticateToken from './midlleware/Token';
import { APP_PORT } from './config/constant';
import Main from './main';
import apiExterneRouter from './routes/API-Externe.routes';
import UserController from './module/Account/User/User.controller';

const app = express();
connectDB().then(() => {
  Main.main();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use('/API', authenticateToken, apiRouter);
app.use('/', apiExterneRouter)
app.use('/home',UserController.test)
app.listen(APP_PORT, () => {
  console.log(`->Serveur en cours d'exécution sur le port ${APP_PORT}`);
});

