export class AccountError extends Error {

    codigo: number;
    constructor(message: string = "Error desconocido", codigoError: number = 1) {
        super(message);
        this.name = "LoginError";
        this.codigo = codigoError
    }
}

export class WrongUsernameOrPasswordError extends AccountError {
    constructor() {
        super("Username o password incorrectos", 2);
        this.name = "EmptyUsernameOrPasswordError";

    }
}

export class EmptyFieldError extends AccountError {
    constructor() {
        super("Alguno de los campos está vacío", 3);
        this.name = "EmptyFieldError";

    }
}


export class UsernameInUseError extends AccountError {
    constructor() {
        super("El nombre de usuario ya está en uso", 4);
        this.name = "UsernameInUseError";

    }
}

export class EmailInUseError extends AccountError {
    constructor() {
        super("El correo ya está en uso", 5);
        this.name = "EmailInUseError";

    }
}

export class MissingTokenError extends AccountError {
    constructor() {
        super("Token de verificación no proporcionado", 6);
        this.name = "MissingTokenError";
    }
}
