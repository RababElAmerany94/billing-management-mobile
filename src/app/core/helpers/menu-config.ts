import { RouteName } from '../enums/route.enum';

export interface IMenuItem {

    /**
     * the id of menu item
     */
    moduleId?: number;

    /**
     * the icon of menu item
     */
    icon?: string;

    /**
     * the URL of menu item
     */
    url?: string;

    /**
     * title of menu item
     */
    title?: string;

}
export class MenuConfig {
    /**
     * list of pages
     */
    static getListPages(): IMenuItem[] {
        return [
            {
                title: 'MENU.DASHBOARD',
                url: `/${RouteName.Dashboard}`,
                icon: 'analytics'
            },
            {
                title: 'MENU.CLIENTS',
                url: `/${RouteName.Clients}`,
                icon: 'people'
            },
            {
                title: 'MENU.DOSSIERS',
                url: `/${RouteName.Dossier}`,
                icon: 'folder'
            },
            {
                title: 'MENU.DEVIS',
                url: `/${RouteName.Devis}`,
                icon: 'document-text'
            },
            {
                title: 'MENU.BON_COMMANDE',
                url: `/${RouteName.BonCommande}`,
                icon: 'document'
            },
            {
                title: 'MENU.AGENDA_COMMERCIAL',
                url: `/${RouteName.AgendaCommercial}`,
                icon: 'calendar'
            },
            {
                title: 'MENU.LOGOUT',
                url: '/log-out',
                icon: 'log-out'
            }
        ];
    }
}
