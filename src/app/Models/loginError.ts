export class LoginError extends Error {

    codigo: number;
    constructor(message: string, codigoError: number) {
        super(message);
        this.name = "LoginError";
        this.codigo = codigoError
    }
}   