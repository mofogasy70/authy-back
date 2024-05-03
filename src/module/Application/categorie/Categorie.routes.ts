import CategorieController from "./Categorie.controller";
import { Router } from 'express';
// import multer from "multer";
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'src/Logo')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   });
// const upload = multer({ storage });

const Categorierouter = Router();
/**
 * @swagger
 * /API/Categories:
 *   get:
 *     summary: Récupère tous les rôles.
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
Categorierouter.get("/", CategorieController.getCategories);


Categorierouter.get("/:id", CategorieController.findCategories);
/**
 * @swagger
 * /API/Categories:
 *   post:
 *     summary: creer un rôles.
 *     description: Cette route ne nécessite un paramètre de requête ou de corps:Nom{String} et vous devez fournir un token d'authentification dans l'en-tête "x-auth-token".
 *     parameters:
 *       - in: header
 *         name: aux-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification nécessaire pour accéder à la ressource.
 *       - in: body
 *         name: role
 *         required: true
 *         description: Objet JSON contenant les détails du rôle à créer.
 *         schema:
 *           type: object
 *           properties:
 *             nom:
 *               type: string 
 *         example:
 *           nom: Admin
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
/**
 * @swagger
 * /API/Categories/{id}:
 *   put:
 *     summary: Modifie un rôles donnee.
 *     description: Cette route ne nécessite les attribut modifier(body), et vous devez fournir un token d'authentification dans l'en-tête "x-auth-token".
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
 *         description: ID du rôle à mettre à jour.
 *         schema:
 *           type: string 
 *     requestBody:
 * 
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
Categorierouter.put("/:id", CategorieController.updateCategories);
/**
 * @swagger
 * /API/Categories/{id}:
 *   delete:
 *     summary: supprime un rôles donnee.
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
 *         description: ID du rôle à mettre à jour.
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
Categorierouter.delete("/:id", CategorieController.deleteCategories);

export default Categorierouter;

