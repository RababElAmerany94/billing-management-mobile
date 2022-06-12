export interface ICommercialPlanning {

    /** the id of the user */
    id: string;

    /** the first name of the user */
    firstName: string;

    /** the last name of the user */
    lastName: string;

    /** the full name of user */
    fullName: string;

    dossiers: IDossierCommercialPlanning[];
}

export interface IDossierCommercialPlanning {

    /** the id of demande RDV */
    id: string;

    /** the date of intervention of demande RDV */
    dateRDV: Date;

    /** the client of demande RDV */
    clientId: string;

    /** the client addresses */
    siteIntervention: string;

    /** the client contact */
    contact: string;

    /** the client first name */
    clientFirstName: string;

    /** the client last name */
    clientLastName: string;
}
