/**
 * a enumeration define demande list tabs types
 */
export enum DossierListTabs {
    AValider = 0,
    AVenir = 1,
    AReplanifier = 2,
    Toutes = 3
}

export interface ITabDossierListItem {

    /** the type of tab */
    type: DossierListTabs;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;
}
