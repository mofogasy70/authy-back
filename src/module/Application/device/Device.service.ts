import mongoose from "mongoose";
import Device from "./Device.model";
import ConLogService from "../log/ConLog.service";
interface IDeviceData {
    _id: {
        UserApplication: mongoose.Types.ObjectId;
        Day: number;
        Month: number;
        Year: number;
    }
    count: number;
}
interface infointerface {
    coord: { latitude: string, longitude: string },
    device: {
        client: {
            type: string,
            name: string,
            version: string,
            engine: string,
            engineVersion: string
        },
        os: { name: string, version: string, platform: string },
        device: { type: string, brand: string, model: string },
        bot: any
    }
}
interface DeviceInput {
    system: string,
    version: string,
    platform: string,
    deviceType: string,
    deviceBrand: string,
    deviceModel: string,
    IP: string,
    User: mongoose.Types.ObjectId
    status: number
}
class DeviceService {
    async createDevices(DeviceInput: DeviceInput) {
        try {
            const DeviceTemp = new Device({
                ...DeviceInput
            });
            return await DeviceTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteDevices(id: String) {
        try {
            return await Device.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateDevices(id: String, newData: object) {
        try {
            return await Device.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async blokDevice(id: string) {
        try {
            return await Device.findByIdAndUpdate(id, { status: 1 }, { new: true });
        } catch (error) {
            throw error
        }
    }
    async AllowDevice(id: string) {
        try {
            return await Device.findByIdAndUpdate(id, { status: 0 }, { new: true });
        } catch (error) {
            throw error
        }
    }
    async getdevices(status: number, user: string, page: number, limit: number) {
        try {
            const pipeline = [
                {
                    $match: {
                        User: new mongoose.Types.ObjectId(user),
                        status: status
                    }
                },
                {
                    $skip: limit * (page - 1)
                },
                {
                    $limit: limit
                }
            ]
            const totalCount = await Device.aggregate([
                {
                    $match: {
                        status: status,
                        User: new mongoose.Types.ObjectId(user)
                    }
                },
                { $count: 'deviceCount' }
            ]);
            let t = 0;
            if (totalCount.length !== 0) {
                t = totalCount[0].deviceCount
            }
            const totalPages = Math.ceil(t / limit);
            const device = await Device.aggregate(pipeline);
            console.log({
                docs: device,
                metadata: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: t,
                    nextPage: (page + 1) > totalPages ? 1 : page + 1,
                    prevPage: (page - 1) < 1 ? totalPages : page - 1
                }
            });
            return {
                docs: device,
                metadata: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: totalCount,
                    nextPage: (page + 1) > totalPages ? 1 : page + 1,
                    prevPage: (page - 1) < 1 ? totalPages : page - 1
                }
            };
        } catch (error) {
            throw error
        }
    }
    async verifDevice(info: infointerface, ip: string, userApplication:any, action: boolean, reason: string) {
        const basedevice = {
            system: info.device.os.name,
            version: info.device.os.version,
            platform: info.device.os.platform,
            deviceType: info.device.device.type,
            deviceBrand: info.device.device.brand,
            deviceModel: info.device.device.model,
            IP: ip,
        }
        const baseAdditData = {
            CorLat: info.coord.latitude,
            CorLong: info.coord.longitude,
            BrowserName: info.device.client.name,
            BrowserType: info.device.client.type,
            BrowserVersion: info.device.client.version,
            BrowserEngine: info.device.client.engine,
        }
        try {
            const device = await Device.findOne({
                ...basedevice,
                User: userApplication.User,
            })
            if (device) {
                if (device.status === 0) {
                    await ConLogService.createConLogs({
                        ...baseAdditData,
                        device: device._id,
                        UserApplication: userApplication._id,
                        reason: reason,
                        status: action
                    });
                }
                else {
                    await ConLogService.createConLogs({
                        ...baseAdditData,
                        device: device._id,
                        UserApplication: userApplication._id,
                        reason: "this device is bloked",
                        status: action
                    });
                    throw new Error("this device is bloked")
                }

            }
            else {
                const tempdevice = await this.createDevices({
                    ...basedevice,
                    status: 0,
                    User: userApplication.User,
                })
                await ConLogService.createConLogs({
                    ...baseAdditData,
                    device: tempdevice._id,
                    UserApplication: userApplication._id,
                    status: action
                });
            }
        } catch (error) {
            throw error
        }
    }
}
export default new DeviceService();
