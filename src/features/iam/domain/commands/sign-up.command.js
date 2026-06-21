export class SignUpCommand {
    constructor({email, password, passwordConfirmation, role = 'User'}) {
        this.email = email;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
        this.role = role;
    }
}