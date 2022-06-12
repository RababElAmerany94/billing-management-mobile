/**
 * a enumeration define fiche controle tabs types
 */
export enum FichierControleTabs {
    Info = 0,
    ConstatComble = 1,
    ConstatPlanchers = 2,
    ConstatMurs = 3
}
export interface ITabFichierControleItem {

    /** the type of tab */
    type: FichierControleTabs;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;
}
