import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import TokenServices from '../module/Security/Token/Token.services';
import { CODE_TOKEN } from '../config/constant';
 async function veriftokenBase(token:string,userId:String) {
  const Tokenbase = await TokenServices.getTokens(token,userId);
  if (!Tokenbase) {
     throw new Error('Token expiré, veuillez vous réauthentifier');
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Token non trouvé, veuillez vous authentifier' });
  }
  try {
    jwt.verify(token,CODE_TOKEN);
    const decoded: any = jwt.decode(token);
    veriftokenBase(token,decoded.UserId);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Token expiré, veuillez vous réauthentifier' });
  }
};

export default authenticateToken;




