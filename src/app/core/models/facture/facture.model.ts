import { RemiseType } from '../../enums/remise-type.enum';
import { IClient } from 'src/app/pages/clients/client.model';
import { IDevis } from 'src/app/pages/devis/devis.model';
import { IDocumentAssociate } from '../general/documentAssociate.model';
import { FactureType } from '../../enums/facture-type.enum';
import { MontantType } from '../../enums/montant-type.enum';
import { IArticle } from '../general/article.model';
import { IMailHistoryModel } from '../general/mail.model';
import { Memo } from '../general/memo.model';
import { IHistorique } from '../general/historique';
import { FactureStatus } from '../../enums/facture-status.enum';

/** an interface describe facture  */
export interface IFacture {

    /** the id of facture */
    id: string;

    /** the status of facture */
    status: number;

    /** the reference of facture */
    reference: string;

    /** the date of creation of facture */
    dateCreation: Date;

    /** the deadline date of facture */
    dateEcheance: Date;

    /** the article of facture */
    articles: IArticle[];

    /** the object of facture */
    objet: string;

    /** is this facture accounting */
    comptabilise: boolean;

    /** the condition regelement of facture */
    reglementCondition: string;

    /** the note of facture */
    note: string;

    /** the current counter of facture */
    counter: number;

    /** the total HT of facture */
    totalHT: number;

    /** the total TTC of facture */
    totalTTC: number;

    /** the remise of facture */
    remise: number;

    /** the remise type of facture */
    remiseType: RemiseType;

    /** the type of facture */
    type: FactureType;

    /** the total without tax of devis */
    totalReduction: number;

    /** the total paid of devis */
    totalPaid: number;

    /** the numero AH of client */
    numeroAH: string;

    /** the history of facture */
    historique: IHistorique[];

    /** the list of memos */
    memos: Memo[];

    /** the list of email */
    emails: IMailHistoryModel[];

    /** the client id associate with this facture */
    clientId: string;

    /** the client associate with this facture */
    client: IClient;

    /** the list of devis associate with this facture */
    devis: IFactureDevis[];

    /** the list of devis associate with this facture */
    documentAssociates: IDocumentAssociate[];

}

export interface IFactureModel {

    /** the status of facture */
    status: FactureStatus;

    /** the reference of facture */
    reference: string;

    /** the list paiement facture */
    // facturePaiements: IFacturePaiment[];

    /** the date of creation of facture */
    dateCreation: Date;

    /** the deadline date of facture */
    dateEcheance: Date;

    /** the article of facture in format JSON */
    articles: IArticle[];

    /** the object of facture */
    objet: string;

    /** the condition regelement of facture */
    reglementCondition: string;

    /** the note of facture */
    note: string;

    /** the current counter of facture */
    counter: number;

    /** the total HT of facture */
    totalHT: number;

    /** the total TTC of facture */
    totalTTC: number;

    /** the remise of facture */
    remise: number;

    /** the remise type of facture */
    remiseType: RemiseType;

    /** the type of facture */
    type: FactureType;

    /** the total without tax of devis */
    totalReduction: number;

    /** the total paid of devis */
    totalPaid: number;

    /** the numero AH of client */
    numeroAH: string;

    /** the client id associate with this facture */
    clientId?: string;

    /** the list of devis associate with this facture */
    devis: IFactureDevisModel[];

    /** the list of associate document */
    documentAssociates: IDocumentAssociate[];
}

export interface IFactureDataTables {

    /** the id of facture */
    id: string;

    /** the status of facture */
    status: number;

    /** the type of facture */
    type: FactureType;

    /** the reference of facture */
    reference: string;

    /** the client name */
    clientId: string;

    /** the date of creation of facture */
    dateCreation: Date;

    /** the deadline date of facture */
    dateEcheance: Date;

    /** the total TTC of facture */
    totalTTC: string;

    /** is this facture has possibility to modify */
    isModify: boolean;
}

export interface IFactureDevis {

    /** is this facture has possibility to modify */
    montant: number;

    /** is this facture has possibility to modify */
    montantType: MontantType;

    /** the id of devis associate with this class */
    devisId: string;

    /** the devis associate with this class */
    devis: IDevis;

    /** the id of facture associate with this class */
    factureId: string;

    /** the facture associate with this class */
    facture: IFacture;

    /** the date of creation */
    createdOn: Date;
}

export interface IFactureDevisModel {

    /** is this facture has possibility to modify */
    montant: number;

    /** is this facture has possibility to modify */
    montantType: MontantType;

    /** the id of devis associate with this class */
    devisId: string;
}
