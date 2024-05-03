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
Userrouter.get("/", UserController.getUsers);
Userrouter.get("/client/", UserController.getclient);
Userrouter.get("/admin/", UserController.getAdmin);
Userrouter.get("/dev/", UserController.getDev);
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
Userrouter.get("/:_id", UserController.FindUsersById);
/**
 * @swagger
 * /API/Users:
 *   post:
 *     summary: creer un Users.
 *     description: Cette route ne nécessite un paramètre de requête ou de corps:Nom{String} et vous devez fournir un token d'authentification dans l'en-tête "x-auth-token".
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification nécessaire pour accéder à la ressource.
 *     requestBody:
 *       description: Informations d'authentification de l'utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nom:
 *                 type: string
 *                 description: Nom de l'utilisateur.
 *               Prenom:
 *                 type: string
 *                 description: Prenom de l'utilisateur.
 *               Adresse:
 *                 type: string
 *                 description: Adresse de l'utilisateur.
 *               Role:
 *                 type: string
 *                 description: Role de l'utilisateur.
 *               DateN:
 *                 type: string
 *                 description: date de naissance de l'utilisateur.
 *               Mdps:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *               Numero:
 *                 type:string
 *             example:
 *               Nom: mamisoa
 *               Prenom: tafita     
 *               Adresse: lot 2        
 *               DateN: 2001-04-19        
 *               Role: 64f4b311bfa5f7907bb1fd8b        
 *               Mdps: 1234      
 *     responses:
 *       200:
 *         description:  Succès. Retourne un message de confimation en Json.
 *         content:
 *           application/json:
 *             schema:
 *               type: Object
 *       401:
 *         description: Token non trouvé, veuillez vous authentifier
 *       500:
 *         description: Erreur interne du serveur.
 */
Userrouter.post("/", UserController.createUsers);
/**
 * @swagger
 * /API/Users/{id}:
 *   put:
 *     summary: Modifie les donnee d' un User .
 *     description: Cette route ne nécessite les attributs modifier( dans body), et vous devez fournir un token d'authentification dans l'en-tête "x-auth-token" sans oublier l'id en params.
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification nécessaire pour accéder à la ressource.
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du user à mettre à jour.
 *         schema:
 *           type: string 
 *     requestBody:
 *       description: Objet JSON contenant le nouveau nom.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nom:
 *                 type: string  # Le type de l'attribut 1 (vous pouvez le modifier selon vos besoins).
 *             example:
 *               Nom: test
 *     responses:
 *       200:
 *         description:  Succès. Retourne un message de confimation en Json.
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
Userrouter.put("/:id", UserController.updateUsers);
/**
 * @swagger
 * /API/Users/{id}:
 *   delete:
 *     summary: supprime un User.
 *     description: Cette route ne nécessite pas d' attribut,vous devez fournir un token d'authentification dans l'en-tête "x-auth-token et l'id du role a supprimer".
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification nécessaire pour accéder à la ressource.
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du user supprimer.
 *         schema:
 *           type: string 
 *     responses:
 *       200:
 *         description: Succès. Retourne un message de confimation en Json.
 *         content:
 *           application/json:
 *             schema:
 *               type: Object
 *               items:
 *                 type: String 
 *       401:
 *         description: Token non trouvé, veuillez vous authentifier
 *       500:
 *         description: Erreur interne du serveur.
 */
Userrouter.delete("/:id", UserController.deleteUsers);
/**
 * @swagger
 * /authentification:
 *   post:
 *     summary: creer un Users.
 *     description: route pour se loger /[{email,mdps},{Prenom,mdps}].
 *     requestBody:
 *       description: Informations d'authentification de l'utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Prenom:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur.
 *               Mdps:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *             example:
 *               Prenom: Anjara
 *               Mdps: 1234
 *     responses:
 *       200:
 *         description:  Succès. Retourne un message de confimation en Json.
 *         content:
 *           application/json:
 *             schema:
 *               type: Object
 *       401:
 *         description: Token non trouvé, veuillez vous authentifier
 *       500:
 *         description: Erreur interne du serveur.
 */
Userrouter.post("/auth", UserController.Authentication);
Userrouter.put("/updateName/:id", UserController.updateName);
Userrouter.put("/updateLastName/:id", UserController.updateLastName);
Userrouter.put("/updateDateBirth/:id", UserController.updateDateBirth);
Userrouter.put("/updateAddress/:id", UserController.updateAddress);
Userrouter.put("/updatePhoneNumber/:id", UserController.updatePhoneNumber);
Userrouter.put("/updatePhoneNumber/:id", UserController.updatePhoneNumber);

export default Userrouter;

