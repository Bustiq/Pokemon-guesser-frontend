export class MatchError extends Error {

    codigo: number;
    constructor(codigoError: number) {
        super("Error");
        //this.name = "LoginError";
        this.codigo = codigoError
    }
}