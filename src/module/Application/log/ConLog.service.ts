import ConLog from "./ConLog.model";
import mongoose from "mongoose";
import UserApplication from "../application/UserApplication.model";
import Application from "../application/Application.model";
interface IConLogData {
    _id: {
        UserApplication: mongoose.Types.ObjectId;
        Day: number;
        Month: number;
        Year: number;
    }
    count: number;
}
class ConLogService {
    async getConLogs() {
        try {
            const valiny = await ConLog.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async getIntervalConlog(DateD: Date, DateF: Date, Application: mongoose.Types.ObjectId, User: mongoose.Types.ObjectId) {
        try {
            // console.log(DateD,DateF);
            const userApplication = await UserApplication.findOne({ User: User, Application: Application });
            const valiny = await ConLog.aggregate(
                [
                    {
                        $match: {
                            Date: {
                                $gte: DateD,
                                $lte: DateF
                            },
                            UserApplication: userApplication?._id
                        }
                    },
                    {
                        $group: {
                            _id: {
                                UserApplication: '$UserApplication',
                                Day: { $dayOfMonth: '$Date' },
                                Month: { $month: '$Date' },
                                Year: { $year: '$Date' }
                            },
                            count: { $sum: 1 }
                        }
                    }
                ],
            );
            //console.log(valiny);
            let tab: IConLogData[] = []
            let DateTemp = DateD;
            //console.log(DateTemp);
            DateF.setDate(DateF.getDate() + 1);
            while (DateTemp.getTime() != DateF.getTime()) {
                let compteur: number = 0;
                let temp: IConLogData;
                for (temp of valiny) {
                    let datestring;
                    if (temp._id.Day < 10) { datestring = temp._id.Year + "-" + temp._id.Month + "-0" + temp._id.Day; }
                    else { datestring = temp._id.Year + "-" + temp._id.Month + "-" + temp._id.Day; }
                    const date = new Date(datestring);
                    if (DateTemp.getTime() === date.getTime()) {
                        //console.log(date, DateTemp);
                        tab.push(temp);
                        compteur++;
                        break;
                    }
                }
                if (compteur === 0) {
                    let newTemp: IConLogData = {
                        _id: {
                            UserApplication: userApplication?._id,
                            Day: DateTemp.getDate(),
                            Month: DateTemp.getMonth() + 1,
                            Year: DateTemp.getFullYear()
                        },
                        count: 0
                    }
                    tab.push(newTemp);
                }
                DateTemp.setDate(DateTemp.getDate() + 1);
                compteur == 0;
            }
            //console.log(tab);
            return tab;
        } catch (error) {
            throw error;
        }
    }
    async getDeviceList(application: mongoose.Types.ObjectId, User: mongoose.Types.ObjectId) {
        if (!application) {
            application = (await Application.findOne({ DomainName: "Authy" }))?._id;
        }
        const userApplication = await UserApplication.findOne({ User: User, Application: application });
        const valiny = await ConLog.aggregate(
            [
                {
                    $match: {
                        UserApplication: userApplication?._id
                    }
                },
                {
                    $group: {
                        _id: {
                            system: '$system',
                            IP: '$IP',
                            device: '$device',
                            CorLat: '$CorLat',
                            CorLong: '$CorLong'
                        },
                        count: { $sum: 1 }
                    }
                }
            ],
        );
        return valiny;
    }
    async createConLogs(
        CorLat: string,
        CorLong: string,
        system: string,
        device: string,
        IP: string,
        Browser: string,
        UserApplication: string,
        status:boolean) {
        try {
            const ConLogTemp = new ConLog({
                Date: new Date(),
                CorLat,
                CorLong,
                system,
                device,
                IP,
                Browser,
                UserApplication,
                status
            });
            return await ConLogTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteConLogs(id: String) {
        try {
            return await ConLog.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateConLogs(id: String, newData: object) {
        try {
            return await ConLog.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
}
export default new ConLogService();
