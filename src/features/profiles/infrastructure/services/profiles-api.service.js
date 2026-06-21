import { BaseApi } from '../../../../shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '../../../../shared/infrastructure/apis/base-endpoint.js';

const completeProfileAsTechnicianPath = import.meta.env.VITE_COMPLETE_PROFILE_AS_TECHNICIAN;
const completeProfileAsHomeownerPath = import.meta.env.VITE_COMPLETE_PROFILE_AS_HOMEOWNER;
const completeProfileAsCompanyPath = import.meta.env.VITE_COMPLETE_PROFILE_AS_COMPANY;
const getProfileStatusPath = import.meta.env.VITE_GET_PROFILE_STATUS;
const patchPersonalDataPath = import.meta.env.VITE_PATCH_PERSONAL_DATA;
const patchTechnicianDataPath = import.meta.env.VITE_PATCH_TECHNICIAN_DATA;
const patchHomeownerDataPath = import.meta.env.VITE_PATCH_HOMEOWNER_DATA;
const deactivateProfilePath = import.meta.env.VITE_DEACTIVATE_PROFILE;
const reactivateProfilePath = import.meta.env.VITE_REACTIVATE_PROFILE;

export class ProfilesApi extends BaseApi {
    #profilesEndpoint;
    #completeProfileAsTechnicianEndpoint;
    #completeProfileAsHomeownerEndpoint;
    #completeProfileAsCompanyEndpoint;
    #getProfileStatusEndpoint;
    constructor() {
        super();
        this.#profilesEndpoint = new BaseEndpoint(this, '/profiles');
        this.#completeProfileAsTechnicianEndpoint = new BaseEndpoint(this, completeProfileAsTechnicianPath);
        this.#completeProfileAsHomeownerEndpoint = new BaseEndpoint(this, completeProfileAsHomeownerPath);
        this.#completeProfileAsCompanyEndpoint = new BaseEndpoint(this, completeProfileAsCompanyPath);
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

    completeProfileAsCompany(profileData) {
        return this.#completeProfileAsCompanyEndpoint.create(profileData);
    }

    updateProfile(profileId, profileData) {
        return this.#profilesEndpoint.update(profileId, profileData);
    }

    getProfileStatus() {
        return this.#getProfileStatusEndpoint.getAll();
    }

    patchPersonalData(data) {
        return this.http.patch(patchPersonalDataPath, data);
    }

    patchTechnicianData(data) {
        return this.http.patch(patchTechnicianDataPath, data);
    }

    patchHomeownerData(data) {
        return this.http.patch(patchHomeownerDataPath, data);
    }

    deactivateProfile(data) {
        return this.http.post(deactivateProfilePath, data);
    }

    reactivateProfile() {
        return this.http.post(reactivateProfilePath, {});
    }
}
