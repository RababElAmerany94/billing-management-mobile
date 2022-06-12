import { TabType } from 'src/app/core/enums/tab-type.enum';

/**
 * an interface define tab detail item
 */
export interface ITabDetailItem {

    /** the type of tab */
    type: TabType;

    /** the icon of tab */
    icon: string;

    /** the label of tab */
    label: string;

    /** is this tab selected */
    selected: boolean;

    /** is this tab appear */
    appear: boolean;
}
