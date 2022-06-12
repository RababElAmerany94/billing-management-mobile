import { Address } from '../general/address.model';
import { IContact } from '../general/contacts.model';
import { IHistorique } from '../general/historique';

export interface IFournisseur {
    id: string;
    reference: string;
    raisonSociale: string;
    historique: IHistorique[];
    webSite: string;
    codeComptable: string;
    siret: string;
    phoneNumber: string;
    email: string;
    addresses: Address[];
    contacts: IContact[];
}

export interface IFournisseurModel {
    reference: string;
    raisonSociale: string;
    webSite: string;
    codeComptable: string;
    siret: string;
    phoneNumber: string;
    email: string;
    addresses: Address[];
    contacts: IContact[];
}
