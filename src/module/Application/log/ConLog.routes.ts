import ConLogController from "./ConLog.controller";
import { Router } from 'express';

const ConLogrouter = Router();
ConLogrouter.post("/", ConLogController.getIntervalConlog);
ConLogrouter.post("/getDeviceList", ConLogController.getDeviceList);

export default ConLogrouter;