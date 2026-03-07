export class SignUpCommand {
    constructor({email, password,passwordConfirmation}) {
        this.email = email;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }
}