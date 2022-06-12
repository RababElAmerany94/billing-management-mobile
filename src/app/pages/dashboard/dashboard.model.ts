import { IUser } from './../../core/models/user/userModel';
import { DocType } from './../../core/enums/doctype.enums';
import { TypeTravaux } from 'src/app/core/enums/type-travaux.enum';

/**
 * interface describe dashboard model
 */
export interface IDashboardModel {

    /** the labels of dashboard */
    labels: string[];

    /**  the list of value */
    serie: number[];
}


export interface IChartData {
    labels: string[];
    serie: number[];
}

export interface INotification {
    id: string;
    title: string;
    docType: DocType;
    identityDocument: number;
    isSeen: boolean;
    userId: string;
    user: IUser;
}

export interface IRepartitionTypesTravauxParTechnicien {
    technicienId: string;
    technicien: string;
    surfaceTraiter: number;
    surfaceParTypeTravaux: ISurfaceParTypeTravaux[];
}

export interface ISurfaceParTypeTravaux {
    typeTravaux: TypeTravaux;
    surfaceTraiter: number;
}

export interface IRepartitionDossiersTechnicien {
    technicien: string;
    technicienId: string;
    nombreDossiers: number;
}
