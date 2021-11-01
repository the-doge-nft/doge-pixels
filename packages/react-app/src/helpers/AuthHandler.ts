import LocalStorage from "../services/local-storage";


export interface AuthObj {
    AccessToken: string;
    RefreshToken: string;
    ExpiresIn: number;
}

const LS_AUTH_KEY = 'auth'

//@TODO: WE PROBABLY DONT NEED THIS
class AuthHandler {
    get auth(): AuthObj | undefined {
        return LocalStorage.getItem(LS_AUTH_KEY, LocalStorage.PARSE_JSON, undefined)
    }

    set auth(authObj) {
        LocalStorage.setItem(LS_AUTH_KEY, authObj)
    }

    get hasAuthData(): boolean {
        return !!this.auth;
    }

    get authIsEmpty(): boolean {
        return !this.hasAuthData
    }

    removeAuth() {
        LocalStorage.removeItem("auth")
    }
}

export default new AuthHandler()
