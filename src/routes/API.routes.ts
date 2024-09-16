import express from 'express';
import Rolerouter from '../module/Account/Role/Role.routes';
import Applicationrouter from '../module/Application/application/Application.routes';
import UserApplicationrouter from '../module/Application/application/UserApplication.routes';
import UserAppSecurityrouter from '../module/Application/application-serurity/UserAppSecurity.routes';
import UserAppSecurityChecksrouter from '../module/Application/application-security-check/UserAppSecurityChecks.routes';
import ConLogrouter from '../module/Application/log/ConLog.routes';
import Securityrouter from '../module/Security/security/Security.routes';
import Userrouter from '../module/Account/User/User.routes';
import TypeSecurityrouter from '../module/Security/type-security/TypeSecurity.routes';
import Activityrouter from '../module/Application/activity/Activity.routes';
import Platformrouter from '../module/Application/platform/Platform.routes';
import Categorierouter from '../module/Application/categorie/Categorie.routes';
import Devicerouter from '../module/Application/device/Device.routes';


const apiRouter = express.Router();

apiRouter.use('/Users', Userrouter);
apiRouter.use('/Roles', Rolerouter);
apiRouter.use('/Application', Applicationrouter);
apiRouter.use('/UserApplication', UserApplicationrouter);
apiRouter.use('/UserAppSecurity', UserAppSecurityrouter);
apiRouter.use('/UserAppSecurityChecks', UserAppSecurityChecksrouter);
apiRouter.use('/Security', Securityrouter);
apiRouter.use('/TypeSecurity', TypeSecurityrouter);
apiRouter.use('/ConLog', ConLogrouter);
apiRouter.use('/Activity', Activityrouter);
apiRouter.use('/Platform', Platformrouter);
apiRouter.use('/Categorie', Categorierouter);
apiRouter.use('/Device', Devicerouter);

export default apiRouter;