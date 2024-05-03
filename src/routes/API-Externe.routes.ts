import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swaggerSpec';
import UserController from '../module/Account/User/User.controller';
import UserAppSecurityChecksController from '../module/Application/application-security-check/UserAppSecurityChecks.controller';
import Mailrouter from '../module/Security/security/Mail/Mail.routes';
import SMSrouter from '../module/Security/security/Sms/SMS.routes';
import upload from '../midlleware/multer';
import ApplicationController from '../module/Application/application/Application.controller';

const apiExterneRouter = express.Router();
apiExterneRouter.use('/SMS', SMSrouter);
apiExterneRouter.use('/Mail', Mailrouter);
apiExterneRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
apiExterneRouter.post("/Security/Check", UserAppSecurityChecksController.Check);
apiExterneRouter.post("/Security/Init", UserAppSecurityChecksController.Init);
apiExterneRouter.use('/User/avatar/:Name', UserController.getAvatar);
apiExterneRouter.get("/Application/Logo/:Name", ApplicationController.getLogo);
apiExterneRouter.use('/authentification', UserController.Authentication);
apiExterneRouter.use('/authentification_2', UserController.Authentication_2);
apiExterneRouter.post('/checkToken', UserController.checkToken);
apiExterneRouter.post('/exchangeToken', UserController.exchangeToken);
apiExterneRouter.post('/Register', upload.single("file"), UserController.Register);
apiExterneRouter.post('/test',UserController.Register);

export default apiExterneRouter;