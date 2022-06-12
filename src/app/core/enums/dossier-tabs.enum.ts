/**
 * a enumeration define show tabs types
 */
export enum ShowTabs {
    Info = 0,
    visiteTechnique = 1,
    History = 2,
    Memo = 3,
    AgendaCommercial = 4,
}
export interface ITabShowItem {

    /** the type of tab */
    type: ShowTabs;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;

    /** is this tab appear */
    appear: boolean;
}
