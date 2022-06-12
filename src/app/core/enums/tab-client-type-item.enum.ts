import { ClientType } from './client-type.enum';

export interface TabClientTypeItem {

    /** the type of tab */
    type: ClientType;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;
}
