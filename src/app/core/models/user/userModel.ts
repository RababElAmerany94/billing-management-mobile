import { IAgence } from '../agence/agence.model';
import { IHistorique } from '../general/historique';
import { Memo } from '../general/memo.model';

/**
 * an interface describe IUser
 */
export interface IUser {

    /** the id of user */
    id: string;

    /** the first name */
    firstName: string;

    /** the last name */
    lastName: string;

    /** the full name */
    fullName: string;

    /** the address email */
    email: string;

    /** the phone number */
    phoneNumber: string;

    /** the username of user */
    userName: string;

    /** is the user is active */
    isActive: boolean;

    /** the last connection of user */
    lastConnection?: Date;

    /** the registration Number of user */
    registrationNumber: string;

    /** the history of user */
    historique: IHistorique[];

    /** the login of agence */
    agenceLogin?: IAgence;

    /** the agence */
    agence?: IAgence;

    /** the date created of user */
    createdOn: Date;

    /** the memo of agence */
    memos: Memo[];

    /** the agence id */
    agenceId?: string;

    /** the role id of user */
    roleId: number;
}

/**
 * a class describe user model
 */
export interface IUserModel {

    /** the id of user */
    id: string;

    /** the first name */
    firstName: string;

    /** the last name */
    lastName: string;

    /** the full name */
    fullName: string;

    /** the address email */
    email: string;

    /** the phone number */
    phoneNumber: string;

    /** the username of user */
    userName: string;

    /** is the user is active */
    isActive: boolean;

    /** the registration Number of user */
    registrationNumber: string;

    /** the date created of user */
    createdOn: Date;

    /** the agence id */
    agenceId?: string;

    /** the role id of user */
    roleId: number;
}

/**
 * user lite information
 */
export interface IUserLiteModel {

    /** the id of user */
    id: string;

    /** the first name of user */
    firstName: string;

    /** the last name of user */
    lastName: string;

    /** the userName of user  */
    userName: string;

    /** the full name of user */
    fullName: string;
}
