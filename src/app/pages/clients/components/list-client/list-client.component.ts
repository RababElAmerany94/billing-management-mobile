import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { IClientFilterOption, IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { StringHelper } from 'src/app/core/helpers/string';
import { BaseListComponent } from 'src/app/shared/base-features/base-list.component';
import { IClient } from '../../client.model';

@Component({
    selector: 'app-list-client',
    templateUrl: './list-client.component.html',
    styleUrls: ['../../../../../assets/components/lists.scss'],
})
export class ListClientComponent extends BaseListComponent<IClient, number> {

    @Input()
    set data(values: IPagedResult<IClient>) {
        if (values != null) {
            this.clientAsPage = { ...values as IPagedResult<any> };
            this.clients = values.value;
        }
    }

    @Input()
    set tabType(value: ClientType) {
        if (value != null) {
            this.type = value;
            this.initializeFilter();
        }
    }

    /** list clients */
    clients: IClient[];

    /** the list of clients as page result */
    clientAsPage: IPagedResult<IClient>;

    /** the selected tabs */
    type: ClientType;

    /** the filter option */
    filterOption: IClientFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: '',
    };

    constructor(
        public translate: TranslateService,
        private alertController: AlertController
    ) {
        super();
        this.setModule(this.modules.Clients);
    }

    //#region form filter

    initializeFilter() {
        switch (this.type) {

            case ClientType.Professionnel:
                this.filterOption.type = ClientType.Professionnel;
                break;

            case ClientType.Particulier:
                this.filterOption.type = ClientType.Particulier;
                break;

            case ClientType.Obliges:
                this.filterOption.type = ClientType.Obliges;
                break;
        }
    }

    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOption = { ...this.filterOption, ...dataTableOutput };
        this.filters.emit(this.filterOption);
    }

    //#endregion


    //#region helper

    /** generate color as client type */
    getColor = (type: ClientType) => StringHelper.getColor(`CLIENT_TYPE.${type}`);

    /**
     * delete click
     */
    deleteClick(id: string) {
        const client = this.clients[id];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('LIST.DELETE.HEADER'),
                message: `${this.translate.instant('LIST.DELETE.MESSAGE')}: ${client.fullName.toUpperCase()} ?`,
                done: async () => {
                    this.deleteEvent.emit(client.id);
                },
                cancel: () => { }
            }
        );
    }

    //#endregion
}
