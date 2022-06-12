import { Address } from '../general/address.model';
import { IContact } from '../general/contacts.model';
import { IHistorique } from '../general/historique';
import { IUser } from '../user/userModel';

/**
 * an interface describe agence
 */
export interface IAgence {

    /**
     * the id of agence
     */
    id: string;

    /**
     * reference agence
     */
    reference: string;

    /**
     * raison sociale of agence
     */
    raisonSociale: string;

    /**
     * format juridique of agence
     */
    formeJuridique: string;

    /**
     * the capital of agence
     */
    capital: string;

    /**
     * the numero TVA intra
     */
    numeroTvaINTRA: string;

    /**
     * siret of agence
     */
    siret: string;

    /**
     * email of agence
     */
    email: string;

    /**
     * phone number of agence
     */
    phoneNumber: string;

    /**
     * code comptable of agence
     */
    codeComptable: string;

    /**
     * date start activity
     */
    dateDebutActivite: Date;

    /**
     * date end activity
     */
    dateFinActivite: Date;

    /**
     * the isActive of agence
     */
    isActive: boolean;

    /**
     * the address of facturation
     */
    adressesFacturation: Address[];

    /**
     * the address of livraison
     */
    adressesLivraison: Address[];

    /**
     * the contacts of agence
     */
    contacts: IContact[];

    /**
     * history of agence
     */
    historique: IHistorique[];

    /**
     * the regulation mode of agence
     */
    regulationModeId: string;

    /**
     * the memos of agence
     */
    memos: string;

    /**
     * the user information of agence
     */
    agenceLogin: IUser;
}

/**
 * an interface describe agence model
 */
export interface IAgenceModel {

    /**
     * reference agence
     */
    reference: string;

    /**
     * raison sociale of agence
     */
    raisonSociale: string;

    /**
     * format juridique of agence
     */
    formeJuridique: string;

    /**
     * the capital of agence
     */
    capital: string;

    /**
     * the numero TVA intra
     */
    numeroTvaINTRA: string;

    /**
     * siret of agence
     */
    siret: string;

    /**
     * email of agence
     */
    email: string;

    /**
     * phone number of agence
     */
    phoneNumber: string;

    /**
     * accounting code of agence
     */
    codeComptable: string;

    /**
     * date start acivity of agence
     */
    dateDebutActivite: Date;

    /**
     * date end acivity of agence
     */
    dateFinActivite: Date;

    /**
     * the isActive of agence
     */
    isActive: boolean;

    /**
     * the address of facturation
     */
    adressesFacturation: Address[];

    /**
     * the address of livraison
     */
    adressesLivraison: Address[];

    /**
     * the contacts of agence
     */
    contacts: IContact[];

    /**
     * the regulation mode of agence
     */
    regulationModeId?: string;

}
