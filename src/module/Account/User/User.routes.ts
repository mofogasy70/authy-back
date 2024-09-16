import { Router } from 'express';
import UserController from './User.controller';
const Userrouter = Router();
/**
 * @swagger
 * /API/Users:
 *   get:
 *     summary: Récupère tous les Users.
 *     description: Cette route ne nécessite aucun paramètre de requête ou de corps, mais vous devez fournir un token d'authentification dans l'en-tête "x-auth-token".
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification nécessaire pour accéder à la ressource.
 *     responses:
 *       200:
 *         description: Succès. Retourne un tableau de rôles en JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object 
 *       401:
 *         description: Token non trouvé, veuillez vous authentifier
 *       500:
 *         description: Erreur interne du serveur.
 */
Userrouter.get("/getdashboard", UserController.getdashboard);
Userrouter.get("/", UserController.getUsers);
Userrouter.get("/client/", UserController.getclient);
Userrouter.get("/admin/", UserController.getAdmin);
Userrouter.get("/dev/", UserController.getDev);
Userrouter.get("/:_id", UserController.FindUsersById);
Userrouter.post("/", UserController.createUsers);
Userrouter.put("/:id", UserController.updateUsers);
Userrouter.delete("/:id", UserController.deleteUsers);
Userrouter.post("/auth", UserController.Authentication);
Userrouter.put("/updateName/:id", UserController.updateName);
Userrouter.put("/updateLastName/:id", UserController.updateLastName);
Userrouter.put("/updateDateBirth/:id", UserController.updateDateBirth);
Userrouter.put("/updateAddress/:id", UserController.updateAddress);
Userrouter.put("/updatePhoneNumber/:id", UserController.updatePhoneNumber);
Userrouter.put("/updatePhoneNumber/:id", UserController.updatePhoneNumber);
Userrouter.get("/getByAdmin", UserController.getUserByAdmin);


export default Userrouter;

