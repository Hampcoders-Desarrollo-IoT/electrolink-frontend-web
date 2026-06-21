import axios from 'axios';
import {iamInterceptor} from "@/features/iam/infrastructure/services/iam.interceptor.js";

const platformApi = import.meta.env.VITE_ELECTROLINK_PLATFORM_API_URL;

export class BaseApi {
    #http;

    get http() {
        return this.#http;
    }

    constructor() {
        this.#http = axios.create({baseURL: platformApi,
            headers: {'Content-Type': 'application/json'},
        });
        this.#http.interceptors.request.use(iamInterceptor);
    }
}