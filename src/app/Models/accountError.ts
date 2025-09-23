export class AccountError extends Error {

    codigo: number;
    constructor(codigoError: number) {
        super("Error");
        //this.name = "LoginError";
        this.codigo = codigoError
    }


}

export class WrongUsernameOrPasswordError extends AccountError {
    constructor() {
        super(2);
        //this.name = "EmptyUsernameOrPasswordError";

    }
}

export class EmptyFieldError extends AccountError {
    constructor() {
        super(3);
        //this.name = "EmptyFieldError";

    }
}


export class UsernameInUseError extends AccountError {
    constructor() {
        super(4);
        //this.name = "UsernameInUseError";

    }
}

export class EmailInUseError extends AccountError {
    constructor() {
        super(5);
        //this.name = "EmailInUseError";

    }
}

export class MissingTokenError extends AccountError {
    constructor() {
        super(6);
        //this.name = "MissingTokenError";
    }
}
