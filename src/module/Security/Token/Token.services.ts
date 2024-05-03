import  Token from "./Token.model";

class TokenService {
    async getTokens(Value: String,UserId:String) {
        try {
            const valiny = Token.findOne({Value:Value,User:UserId});
            return valiny;
        } catch (error) {
            throw error;
        }
    }
    async createTokens(Value: String,User:String,UserApplication:string) {
        try {
            const TokenTemp = new Token({
                Value,User,UserApplication
            });
            return await TokenTemp.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteTokens(id: String) {
        try {
            return await Token.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateTokens(id: String, newData:object) {
        try {
            return await Token.findByIdAndUpdate(id, newData, { new: true });
        } catch (error) {
            throw error;
        }
        
    }
}
export default new TokenService();
