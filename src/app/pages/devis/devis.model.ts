import { DevisStatus } from 'src/app/core/enums/devis-status.enum';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { IAgence } from 'src/app/core/models/agence/agence.model';
import { IFactureDevis } from 'src/app/core/models/facture/facture.model';
import { Address } from 'src/app/core/models/general/address.model';
import { IArticle } from 'src/app/core/models/general/article.model';
import { IDocumentAssociate } from 'src/app/core/models/general/documentAssociate.model';
import { IMailHistoryModel } from 'src/app/core/models/general/mail.model';
import { IUserLiteModel } from 'src/app/core/models/user/userModel';
import { IClient } from '../clients/client.model';
import { IDossierModel } from '../dossier/dossier.model';

/**
 * an interface describe devis entity
 */
export interface IDevis {

    /** the id of devis */
    id: string;

    /** the status of devis */
    status: DevisStatus;

    /** the reference of devis */
    reference: string;

    /**  the date of created of dossier */
    CreatedOn: Date;

    /** the address of intervention devis */
    siteIntervention: Address;

    /** date visit of devis */
    dateVisit: Date;

    /** list of articles */
    articles: IArticle[];

    /** the type of devis */
    type: DevisType;

    /** the total ht of devis */
    totalHT: number;

    /** the total ttc of devis */
    totalTTC: number;

    /** the total reduction of devis  */
    totalReduction: number;

    /** the total to paid of devis */
    totalPaid: number;

    /** the date of signature of devis */
    dateSignature: Date;

    /** the signature of devis */
    signe: string;

    /** the name of client who sign devis */
    nameClientSignature: string;

    /** the note of devis */
    note: string;

    /** the note of devis */
    raisonPerdue: string;

    /** the historique of devis */
    historique: string;

    /** the list of email */
    emails: IMailHistoryModel[];

    /** the technicien id who do the devis */
    userId: string;

    /** the technicien who do the devis */
    user: IUserLiteModel;

    /** the client id associate with devis */
    clientId: string;

    /** the client associate with devis */
    client: IClient;

    /** the dossier id associate with devis */
    dossierId?: string;

    /** the dossier id associate with devis */
    dossier: IDossierModel;

    /** the agence associate with devis */
    agence: IAgence;

    /** the agence id associate with devis */
    agenceId: string;

    /** the facture associate with devis */
    factures: IFactureDevis[];

    /** the list of devis associate with this facture */
    documentAssociates: IDocumentAssociate[];

    /** the id of bon commande associate */
    bonCommandeId?: string;
}

/**
 * an interface describe devis model
 */
export interface IDevisModel {

    /** the reference of devis */
    reference: string;

    /**  the date of created of dossier */
    CreatedOn: Date;

    /** the address of intervention devis */
    siteIntervention: Address;

    /** date visit of devis */
    dateVisit: string;

    /** the date of signature of devis */
    dateSignature: Date;

    /** list of articles */
    articles: IArticle[];

    /** the status of devis */
    status: DevisStatus;

    /** the type of devis */
    type: DevisType;

    /** the total ht of devis */
    totalHT: number;

    /** the total ttc of devis */
    totalTTC: number;

    /** the total reduction of devis  */
    totalReduction: number;

    /** the total to paid of devis */
    totalPaid: number;

    /** the note of devis */
    note: string;

    /** the technicien id who do the devis */
    userId: string;

    /** the client id associate with devis */
    clientId: string;

    /** the dossier id associate with devis */
    dossierId: string;

    /** the agence id associate with devis */
    agenceId: string;

    /** the id of bon commande associate */
    bonCommandeId?: string;
}

/**
 * an interface describe devis model
 */
export interface IDevisDataList {

    /** the id of devis */
    id: string;

    /** the reference of devis */
    reference: string;

    /** the date of signature of devis */
    dateSignature: Date;

    /** the status of devis */
    status: DevisStatus;

    /** the type of devis */
    type: DevisType;

    /** the client associate with devis */
    client: string;

    /** can modify devis */
    canModify: boolean;

    /** the nouveau Avancement Percent of devis */
    nouveauAvancementPercent: number;

}

/** devis signature */
export interface DevisSignatureModel {

    /** devis id */
    devisId: string;

    /** nom signataire */
    nameClientSignature: string;

    /** signataire */
    signe: string;

}
