/**
 * a enumeration define agenda commercial list tabs types
 */
export enum AgendaCommercialListTabs {
    Agenda = 0,
    Tache = 1,
    Rdv = 2,
    Appel = 3
}

export interface ITabAgendaCommercialListItem {

    /** the type of tab */
    type: AgendaCommercialListTabs;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;
}
