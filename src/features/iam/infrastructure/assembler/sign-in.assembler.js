import {SignInResource} from "../resources/sign-in.resource.js";

export class SignInAssembler {
    static toResourceFromResponse(response) {
        console.log(response);
        if (response.status !== 200 && response.status !== 201) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return new SignInResource(response.data);
    }
}