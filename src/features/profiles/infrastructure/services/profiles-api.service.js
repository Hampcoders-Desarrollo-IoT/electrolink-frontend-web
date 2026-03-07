import { BaseApi } from '../../../../shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '../../../../shared/infrastructure/apis/base-endpoint.js';

const completeProfileAsTechnicianPath = import.meta.env.VITE_COMPLETE_PROFILE_AS_TECHNICIAN;
const completeProfileAsHomeownerPath = import.meta.env.VITE_COMPLETE_PROFILE_AS_HOMEOWNER;
const getProfileStatusPath = import.meta.env.VITE_GET_PROFILE_STATUS;

export class ProfilesApi extends BaseApi {
    #profilesEndpoint;
    #completeProfileAsTechnicianEndpoint;
    #completeProfileAsHomeownerEndpoint;
    #getProfileStatusEndpoint;
    constructor() {
        super();
        this.#profilesEndpoint = new BaseEndpoint(this, '/profiles');
        this.#completeProfileAsTechnicianEndpoint = new BaseEndpoint(this, completeProfileAsTechnicianPath);
        this.#completeProfileAsHomeownerEndpoint = new BaseEndpoint(this, completeProfileAsHomeownerPath);
        this.#getProfileStatusEndpoint = new BaseEndpoint(this, getProfileStatusPath);
    }

    getMyProfile() {
        return this.#profilesEndpoint.getById('me');
    }

    getProfile(userId) {
        return this.#profilesEndpoint.getById(userId);
    }

    completeProfileAsTechnician(profileData) {
        return this.#completeProfileAsTechnicianEndpoint.create(profileData);
    }

    completeProfileAsHomeowner(profileData) {
        return this.#completeProfileAsHomeownerEndpoint.create(profileData);
    }

    updateProfile(profileId, profileData) {
        return this.#profilesEndpoint.update(profileId, profileData);
    }

    getProfileStatus() {
        return this.#getProfileStatusEndpoint.getAll();
    }
}
