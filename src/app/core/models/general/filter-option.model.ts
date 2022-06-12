import { EchangeCommercialType } from './../../enums/echange-commercial-type.enum';
import { SortDirection } from '../../enums/sort-direction';
import { ClientType } from '../../enums/client-type.enum';
import { NumerationType } from '../../enums/numerotation.enum';
import { DossierStatus } from '../../enums/dossier-status.enums';
import { PeriodeFilter } from '../../enums/period-filter.enum';

/**
 * the interface that describe the filtering options
 */
export interface IFilterOption {

    /**
     * the search Query to search with it
     */
    SearchQuery: string;

    /**
     * the page index
     */
    Page: number;

    /**
     * the size of the page
     */
    PageSize: number;

    /**
     * the Sort Direction
     */
    SortDirection: SortDirection;

    /**
     * what property to order by with it
     */
    OrderBy: string;
}
/** interface describe department filter option */
export interface IDepartmentFilterOption extends IFilterOption {

    /**
     * the country id
     */
    countryId?: string;
}
export interface IClientFilterOption extends IFilterOption {

    /**
     * the type of client
     */
    types?: ClientType[];

    /** the type of client */
    type?: ClientType;

}

/** interface describe technicien planning filter options */
export interface ICommercialPlanningFilterOption extends IFilterOption {

    /**
     * the filter by date d'intervention
     */
    dateRDV: Date;
}

/**
 * the filter users by roleid
 */
export interface IUserFilterOption extends IFilterOption {
    /**
     * roles id
     */
    rolesId?: number[];
    /**
     * get all users
     */
    isAll?: boolean;
    /**
     * the id of agence
     */
    agenceId?: string;
}

/**
 * a interface describe body of method generate reference accounting document
 */
export interface IBodyReferenceDocumentComptable {

    /**
     * the date of creation
     */
    dateCreation: Date;

    /**
     * the type of numerotation
     */
    type: NumerationType;
}

export interface CheckUserAssignedSameDateAndHourFilterOption {
    dateRdv: Date;
    userId: string;
    excludeDossierId: string;
}

/** interface describe dossier filter options */
export interface IDossierFilterOption extends IFilterOption {

    clientId?: string;

    /** date start */
    dateRdvFrom?: Date;

    /** date start */
    dateRdvTo?: Date;

    /** status */
    status?: DossierStatus;

}

/**
 * a interface describe Echange Commercial filter options
 */
export interface IEchangeCommercialFilterOption extends IFilterOption {

    /** the id of Echange Commercial */
    responsableId?: string;

    /** the category of Echange Commercial */
    categorieId?: string;

    /** the id of Echange Commercial */
    type?: EchangeCommercialType;

    /** the id of Echange Commercial */
    dossierId?: string;

    /** the client id of Echange Commercial */
    clientId?: string;

    /**
     * the date of start
     */
    dateFrom?: Date;

    /**
     * the date of end
     */
    dateTo?: Date;

}

/** the interface describe dashboard filtre option */
export interface IDashboardFilterOption {

    period: PeriodeFilter;

    /** filtre by date from */
    dateFrom?: string;

    /** filtre by date to */
    dateTo?: string;

    /** filtre by client */
    clientId?: string;

    /** filtre by agence */
    agenceId?: string;
}

export interface IAdvanceDashboardFilterOption extends IDashboardFilterOption {
    userId?: string;
}
