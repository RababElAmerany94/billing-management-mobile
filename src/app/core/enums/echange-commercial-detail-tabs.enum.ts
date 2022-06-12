/**
 * a enumeration define show tabs types
 */
export enum EChangeCommercialDetailTabs {
    Info = 0,
    History = 1,
    Memo = 2,
}
export interface ITabEChangeCommercialShowItem {


    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;

    /** the type of tab */
    type: EChangeCommercialDetailTabs;
}
