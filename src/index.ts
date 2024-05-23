import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import connectDB from './config/db';
import apiRouter from './routes/API.routes';
import cors from 'cors';
import authenticateToken from './midlleware/Token';
import { APP_PORT } from './config/constant';
import Main from './main';
import apiExterneRouter from './routes/API-Externe.routes';
import UserController from './module/Account/User/User.controller';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Connexion à la base de données et démarrage du serveur Express
connectDB().then(() => {
  Main.main();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Routes
app.use('/API', authenticateToken, apiRouter);
app.use('/', apiExterneRouter);
app.use('/home', UserController.test);

// Gestion des connexions Socket.io
io.on('connection', (socket: Socket) => {
  socket.on('notification', (data) => {
    try {
      socket.emit(data.UserId, { type: data.type, message: data.message });
    } catch (error) {
      console.log(error);
    }
  });
});

// Démarrage du serveur
server.listen(APP_PORT, () => {
  console.log(`->Serveur en cours d'exécution sur le port ${APP_PORT}`);
});
