import { Access } from '../../enums/access.enum';
import { Modules } from '../../enums/modules.enum';

/** interface describe token model */
export interface ITokenModel {
    userId: string;
    agenceId?: string;
    agence?: string;
    roleId: number;
    isActive: boolean;
    name: string;
    modules: Modules[];
    permissions: IPermissionModel[];
}

export interface IPermissionModel {
    access: Access;
    modules: IPermissionModuleModel[];
}

export interface IPermissionModuleModel {
    moduleId: Modules;
}
