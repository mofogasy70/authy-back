import twilio from 'twilio';
class SMS {
    accountSid: string;
    authToken: string;
    twilioNum: string;
    client: any;
    constructor(accountSid: string, authToken: string, twilioNum: string) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.twilioNum = twilioNum;
        this.client = twilio(this.accountSid, authToken);
    }
    async  sendSms(body: string, to: string) {
        try {
            const message = await this.client.messages.create({
                body: body,
                from: this.twilioNum,
                to: to,
            });
            return (`Message SID: ${message.sid}`);
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi du SMS :' + error);
        }
        return null;
    }
    static tobody(Code:string){
        return "your authy verification code :"+Code;
    }
}
export default SMS;




