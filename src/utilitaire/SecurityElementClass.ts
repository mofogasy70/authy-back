class SecurityElementClass {
    private _idSecurity: string;
    private _maFonction: (userApplication: string) => void;
    constructor(id: string, fonction: (userApplication: string) => void) {
        this._idSecurity = id;
        this._maFonction = fonction;
    }
    get id(): string {
        return this._idSecurity;
    }
    set id(newId: string) {
        this._idSecurity = newId;
    }
    get maFonction(): (userApplication: string) => void {
        return this._maFonction;
    }
    set maFonction(newFunction: (userApplication: string) => void) {
        this._maFonction = newFunction;
    }
    async utiliserFonction(userApplication: string) {
        return await this._maFonction(userApplication);
    }
}
export default SecurityElementClass;
