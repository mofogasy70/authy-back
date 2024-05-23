import ConLog from "./ConLog.model";
import mongoose from "mongoose";
import UserApplication from "../application/UserApplication.model";
import Application from "../application/Application.model";
import { startOfWeek, endOfWeek, format } from 'date-fns';
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
    async getConLogs(page, limit) {
        try {
            const totalCount = await ConLog.countDocuments({});
            const totalPages = Math.ceil(totalCount / limit);
            const logs = await ConLog.find({})
                .skip(limit * (page - 1))
                .limit(limit);
            return {
                docs: logs,
                metadata: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: totalCount,
                    nextPage: (page + 1) > totalPages ? 1 : page + 1,
                    prevPage: (page - 1) < 1 ? totalPages : page - 1
                }
            };
        } catch (error) {
            throw error;
        }
    }
    getWeekRange(date: Date): { startOfWeek: Date; endOfWeek: Date } {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 2 });
        return { startOfWeek: start, endOfWeek: end };
    }

    async getWeekleConLogs() {
        const date = this.getWeekRange(new Date());
        const pipeline = [
            {
                $match: {
                    Date: {
                        $gte: date.startOfWeek,
                        $lt: date.endOfWeek
                    }
                }
            },
            {
                $lookup: {
                    from: 'userapplications',
                    localField: 'UserApplication',
                    foreignField: '_id',
                    as: 'joinedUserApplications'
                }
            },
            { $unwind: '$joinedUserApplications' },
            {
                $lookup: {
                    from: 'applications',
                    localField:
                        'joinedUserApplications.Application',
                    foreignField: '_id',
                    as: 'joinedApplications'
                }
            },
            { $unwind: '$joinedApplications' },
            {
                $addFields: {
                    color: 'green',
                    title: "$joinedApplications.DomainName",
                    start: "$Date",
                    end: {
                        $add: ["$Date", 3600000]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    system: 1,
                    device: 1,
                    IP: 1,
                    Browser: 1,
                    status: 1,
                    start: 1,
                    end: 1,
                    title: 1,
                    color: 1,
                    userapplication: 1
                }
            }
        ];
        try {
            const response = await ConLog.aggregate(pipeline);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getdevice(page, limit) {
        try {
            const pipeline = [
                {
                    $group: {
                        _id: {
                            device: '$device',
                            ip: '$IP',
                            system: '$system'
                        }
                    },
                    

                }
            ]
            const response = await ConLog.aggregate(pipeline);
            return response;
        } catch (error) {
            throw error
        }
    }

    async getIntervalConlog(DateD: Date, DateF: Date, Application: mongoose.Types.ObjectId, User: mongoose.Types.ObjectId) {
        try {
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
            let tab: IConLogData[] = []
            let DateTemp = DateD;
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
        status: boolean) {
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
