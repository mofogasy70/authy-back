import mongoose, { PipelineStage } from "mongoose";
import Activity from "./Activity.model";
class ActivityService {
    async getActivitys() {
        try {
            const valiny = Activity.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createActivitys(status: number, description: string, date: Date, routes: string, UserApplication: mongoose.Types.ObjectId) {
        try {
            const ActivityTemp = new Activity({
                status: status,
                description: description,
                date: date,
                routes: routes,
                UserApplication: UserApplication
            });
            return await ActivityTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteActivitys(id: String) {
        try {
            return await Activity.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateActivitys(id: String, newData: object) {
        try {
            return await Activity.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }

    }
    async getActivitysUser(userApplication: string, page: number, limit: number, params: any) {
        let date1
        let date2
        if (params.createdAt) {
            const str: string = params.createdAt;
            date1 = new Date(Number(str.split("|")[0]))
            date2 = new Date(Number(str.split("|")[1]))
            console.log(date1, " ", date2);
        }
        try {
            const pipeline: PipelineStage[] = [
                {
                    $match: {
                        UserApplication: new mongoose.Types.ObjectId(userApplication),
                        description: { $regex: params.description ? params.description : '', $options: 'i' },
                    }
                },
                {
                    $lookup: {
                        from: 'userapplications',
                        localField: 'UserApplication',
                        foreignField: '_id',
                        as: 'userApplication'
                    }
                },
                { $unwind: '$userApplication' },
                {
                    $lookup: {
                        from: 'applications',
                        localField: 'userApplication.Application',
                        foreignField: '_id',
                        as: 'application'
                    }
                },
                { $unwind: '$application' },
                {
                    $sort: { date: -1 }
                },
                {
                    $skip: limit * (page - 1)
                },
                {
                    $limit: limit
                }
            ]
            if (params.status) {
                pipeline.push({
                    $match: {
                        status: Number(params.status)
                    }
                });
            }
            if (params.UserApplication) {
                pipeline.push({
                    $match: {
                        UserApplication: new mongoose.Types.ObjectId(params.UserApplication)
                    }
                });
            }
            if (date1 && date2) {
                pipeline.push({
                    $match: {
                        date: {
                            $gte: date1,
                            $lte: date2
                        }
                    }
                });
            }
            const totalCount = await Activity.find({ UserApplication: new mongoose.Types.ObjectId(userApplication) }).count();
            const totalPages = Math.ceil(totalCount / limit);
            const response = await Activity.aggregate(pipeline);
            return {
                docs: response,
                metadata: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalCount: totalCount,
                    nextPage: (page + 1) > totalPages ? 1 : page + 1,
                    prevPage: (page - 1) < 1 ? totalPages : page - 1
                }
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
export default new ActivityService();
