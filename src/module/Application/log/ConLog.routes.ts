import ConLogController from "./ConLog.controller";
import { Router } from 'express';

const ConLogrouter = Router();
ConLogrouter.post("/getIntervalConlog", ConLogController.getIntervalConlog);
ConLogrouter.post("/getDeviceList", ConLogController.getDeviceList);
ConLogrouter.get("/", ConLogController.getConLogs);
ConLogrouter.get("/getWeekleConLogs", ConLogController.getWeekleConLogs);

export default ConLogrouter;