import { IAgence } from '../agence/agence.model';
import { BankAccountType } from '../../enums/bank-account.enum';

export interface IBankAccount {

    id: string;

    /**
     * name compte
     */
    name: string;

    /**
     * code comptable
     */

    codeComptable: string;

    /**
     * type compte bancaire
     */

    type: BankAccountType;

    /**
     *  is this account modify
     */

    isModify: boolean;

    /**
     *  the id of agence involved with this account
     */

    agenceId?: string;

    /**
     * the agence involved with this account
     */
    agence: IAgence;
}

