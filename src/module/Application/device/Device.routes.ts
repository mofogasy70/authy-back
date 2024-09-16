import { Router } from 'express';
import DeviceController from "./Device.controller";

const Devicerouter = Router();
Devicerouter.get("/:userApplication", DeviceController.getDevice);
Devicerouter.post("/blokDevice", DeviceController.blokDevice);
Devicerouter.post("/allowDevice", DeviceController.AllowDevice);

export default Devicerouter;