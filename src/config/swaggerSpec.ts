import swaggerJSDoc from 'swagger-jsdoc';
import { APP_PORT } from './constant';
const swaggerDefinition  = {
    openapi:'3.0.0',
    info:{
      title:'Express API for Aro-ko',
      version:'0.1.0',
      description:'Rest API made with Express TS'
    },
    servers:[
      {
        url:'http://localhost:' + APP_PORT,
        description:'serveur'
      },
    ],
};
const options={
  swaggerDefinition ,
  apis: ['src/routes/*.ts'],
}
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
