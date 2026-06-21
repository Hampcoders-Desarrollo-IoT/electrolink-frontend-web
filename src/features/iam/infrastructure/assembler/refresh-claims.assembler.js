import {RefreshClaimsResource} from "../resources/refresh-claims.resource.js";

export class RefreshClaimsAssembler {
    static toResourceFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return new RefreshClaimsResource(response.data);
    }
}