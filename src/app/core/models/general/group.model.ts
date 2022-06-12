import { IAgence } from '../agence/agence.model';

/**
 * an interface describe group
 */
export interface IGroup {

    /** the id of group */
    id: string;

    /** the name of group */
    name: string;

    /** the discount of group */
    remise?: number;

    /** the agence id associate with this group */
    agenceId: string;

    /** the agence id associate with this group */
    agence: IAgence;
}

/**
 * an interface describe group
 */
export interface IGroupModel {

    /** the name of group */
    name: string;

    /** the discount of group */
    remise: number;

    /** the agence id associate with this group */
    agenceId: string;
}
