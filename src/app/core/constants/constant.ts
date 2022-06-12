export class Constants {
    /**
     * regulation mode with avoir
     */
    static RegulationModeAvoirId = 7;
}
export class MsgCode {
    //#region common

    /** reference not unique */
    static ReferenceNotUnique = '1';

    //#endregion

    //#region prestation

    /** the prix prestation par agence already exists */
    static PrixPrestationParAgenceExist = '100';

    //#endregion

    //#region Payment

    /** the amount of payment invalid */
    static AmountPaymentInvalid = '200';

    //#endregion

    //#region Facture

    /** remove facture payments   */
    static RemovePayment = '300';

    //#endregion

    //#region Mail service

    /** the configuration of messagerie doesn't exists */
    static NoConfigMessagerie = '400';

    //#endregion
}
