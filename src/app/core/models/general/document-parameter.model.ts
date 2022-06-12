
/**
 * a interface describe document parameters entity
 */
export interface IDocumentParameters {
    id: string;
    tva: ITvaParameters;
    facture: IFactureDocumentParameters;
    avoir: IAvoirDocumentParameters;
    devis: IDevisDocumentParameters;
    bonCommande: IBonCommandeParameters;
}

/** interface describe document parameters model */
export interface IDocumentParametersModel {
    tva: ITvaParameters;
    facture: IFactureDocumentParameters;
    avoir: IAvoirDocumentParameters;
    devis: IDevisDocumentParameters;
    bonCommande: IBonCommandeParameters;
    agenceId?: string;
}

/**
 * a interface define facture parameters
 */
export interface IFactureDocumentParameters {
    validateDelay: number;
    sujetMail: string;
    contenuMail: string;
    sujetRelance: string;
    contenuRelance: string;
    header: string;
    note: string;
    regulationCondition: string;
}
/**
 * a interface define avoir parameters
 */
export interface IAvoirDocumentParameters {
    validateDelay: number;
    header: string;
    note: string;
    regulationCondition: string;
}

/**
 * a interface describe tva parameters
 */
export interface ITvaParameters {
    defaultValue: number;
    rootAccountingCode: string;
    list: ITvaModel[];
}

/** a interface describe tva model */
export interface ITvaModel {
    value: number;
    accountingCode: string;
}

/** a interface describe devis */
export interface IDevisDocumentParameters {
    sujetMail: string;
    contenuMail: string;
    header: string;
    footer: string;
    note: string;
    regulationCondition: string;
}

/** a interface describe bon de commande */
export interface IBonCommandeParameters {
    sujetMail: string;
    contenuMail: string;
    header: string;
    footer: string;
    note: string;
}
