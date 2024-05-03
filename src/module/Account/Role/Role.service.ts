import Role from "./Role.model";

class RoleService {
    async getRoles() {
        try {
            const valiny =await Role.find();
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createRoles(Name: String,Value:number) {
        try {
            const RoleTemp = new Role({
                Name,
                Value
            });
            return await RoleTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteRoles(id: String) {
        try {
            return await Role.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateRoles(id: String, newData:object) {
        try {
            return await Role.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }
        
    }
}
export default new RoleService();
