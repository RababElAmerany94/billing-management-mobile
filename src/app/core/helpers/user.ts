import { JwtHelper } from 'angular2-jwt';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { StringHelper } from './string';
import { IPermissionModel, ITokenModel } from '../models/general/token.model';
import { UserProfile } from '../enums/user-roles.enum';
import { IUser } from '../models/user/userModel';
import { Modules } from '../enums/modules.enum';
import { Access } from '../enums/access.enum';

/**
 * a class describe user helper
 */
export class UserHelper {

    private static token: string;
    private static tokenExpiration: string;
    private static tokenModel: ITokenModel;
    private static userModel: IUser;
    private static isNotExpired = true;

    /**
     * Check is admin
     */
    static isAdmin = (): boolean => UserHelper.getRole() === UserProfile.Admin;

    /**
     * Check is agence
     */
    static isAdminAgence = (): boolean => UserHelper.getRole() === UserProfile.AdminAgence;

    /**
     * Check is directeur commercial
     */
    static isDirecteur = (): boolean => UserHelper.getRole() === UserProfile.Directeur;

    /**
     * Check is technicien
     */
    static isTechnicien = (): boolean => UserHelper.getRole() === UserProfile.Technicien;

    /**
     * Check is Commercial
     */
    static isCommercial = (): boolean => UserHelper.getRole() === UserProfile.Commercial;

    /**
     * Get User Id
     */
    static getUserId = (): string => UserHelper.getTokeInfo().userId;

    /**
     * Get agence id
     */
    static getAgenceId = () => UserHelper.getTokeInfo().agenceId;

    /**
     * is follow agence
     */
    static isFollowAgence = () => UserHelper.getTokeInfo().agenceId != null;

    /**
     * Get role of current user
     */
    static getRole = (): number => UserHelper.getTokeInfo().roleId;

    /**
     * get permissions list of the current user
     */
    static getPermissions = (): IPermissionModel[] => UserHelper.getTokeInfo().permissions;

    /**
     * get permissions list of the current user
     */
    static getModules = (): string[] => UserHelper.getTokeInfo().modules;

    /**
     * is authenticated
     */
    static isAuthenticated() {
        const token = localStorage.getItem(AppSettings.TOKEN);
        if (this.tokenExpiration !== token) {
            this.tokenExpiration = token;
            const helper = new JwtHelper();
            this.isNotExpired = !StringHelper.isEmptyOrNull(token) && !helper.isTokenExpired(token);
        }
        return this.isNotExpired;
    }

    /**
     * check user has permission
     */
    static hasPermission(module: Modules, access: Access): boolean {
        const permissions = UserHelper
            .getPermissions();

        const result = permissions
            .filter(e => e.access === access && e.modules.filter(m => m.moduleId === module).length > 0).length > 0;

        return result;
    }

    /**
     * is the current user has the same agence id
     */
    static hasOwner(agenceId?: string) {
        const currentAgenceId = UserHelper.getAgenceId();
        return agenceId === currentAgenceId;
    }

    /**
     * get token info
     */
    static getTokeInfo(): ITokenModel {
        if (this.isAuthenticated()) {
            const token = localStorage.getItem(AppSettings.TOKEN);
            if (token === this.token) {
                return this.tokenModel;
            } else {
                this.token = token;
                const helper = new JwtHelper();
                this.tokenModel = UserHelper.mapTokenToTokenModel(helper.decodeToken(token));
                return this.tokenModel;
            }
        }
        return null;
    }

    /**
     * get token info
     */
    static getCurrentUser(): IUser {
        if (this.isAuthenticated()) {
            const token = localStorage.getItem(AppSettings.TOKEN);
            if (token === this.token) {
                return this.userModel;
            } else {
                this.token = token;
                const helper = new JwtHelper();
                this.userModel = UserHelper.mapTokenToIUser(helper.decodeToken(token)) as IUser;
                return this.userModel;
            }
        }
        return null;
    }

    // #region private methods

    /**
     * map information token into token model
     * @param token the token information
     */
    private static mapTokenToTokenModel(token: any): ITokenModel {
        return {
            name: token.name,
            isActive: token.isActive.toLowerCase() === 'true',
            modules: JSON.parse(token.modules),
            permissions: JSON.parse(token.permissions),
            roleId: token.roleId,
            userId: token.userId,
            agenceId: StringHelper.isEmptyOrNull(token.agenceId) ? null : token.agenceId,
            agence: token.agence
        };
    }

    /**
     * map information token into user mode
     * @param token the token information
     */
    private static mapTokenToIUser(token: any): Partial<IUser> {
        return {
            fullName: token.name,
            isActive: token.isActive.toLowerCase() === 'true',
            roleId: token.roleId,
            id: token.userId,
            agenceId: StringHelper.isEmptyOrNull(token.agenceId) ? null : token.agenceId,
        };
    }

    //#endregion

}
