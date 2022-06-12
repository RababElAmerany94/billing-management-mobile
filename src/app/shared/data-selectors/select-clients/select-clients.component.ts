import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { ClientHelper } from 'src/app/core/helpers/client';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IClientFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IClient, IClientModel } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { BaseListComponent } from '../../base-features/base-list.component';
import { SaisieLibreClientComponent } from '../../saisie-libre-client/saisie-libre-client.component';

@Component({
    selector: 'app-select-clients',
    templateUrl: './select-clients.component.html',
    styleUrls: [
        '../../../../assets/components/lists.scss'],
})
export class SelectClientsComponent extends BaseListComponent<IClient, number>  {

    clientAsPage: IPagedResult<IClient>;
    clients: IClient[] = [];
    selectedClientId: string;
    types: ClientType[] = [];

    constructor(
        private clientService: ClientsService,
        private toastService: ToastService,
        public modalController: ModalController,
        private navParams: NavParams,
        private translate: TranslateService) {
        super();
        this.types = this.navParams.get('types');
    }

    //#region services

    /** get list of clients */
    getClients(filterOption: IClientFilterOption) {
        filterOption.types = this.types;
        this.loading = true;
        this.subs.sink = this.clientService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.loading = false;
                if (result.status === ResultStatus.Succeed) {
                    this.clientAsPage = result;
                    if (this.clientAsPage.currentPage === 1) {
                        this.clients = [];
                    }
                    this.clients = [...this.clients, ...this.clientAsPage.value];
                } else {
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
                }
            });
    }

    /**
     * Add client action
     */
    addClientService(clientModel: IClientModel) {
        ClientHelper.CheckReferenceIsUnique(this.clientService, this.toastService, clientModel, this.translate, null, true,
            (checkResult: boolean) => {
                if (checkResult) {
                    this.loading = true;
                    this.clientService.Add(clientModel).subscribe(result => {
                        this.loading = false;
                        if (result.hasValue) {
                            this.toastService.presentToast({ message: this.translate.instant('SUCCESS.ADD'), type: ToastTypes.Success });
                            this.clients.push(result.value);
                            this.selectedClientId = result.value.id;
                            this.chooseClient();
                        } else {
                            this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER'), type: ToastTypes.Danger });
                        }
                    }, _ => this.loading = false);
                }
            });
    }

    //#endregion services

    //#region helper

    async chooseClient() {
        const client = this.clients.find(e => e.id === this.selectedClientId);
        await this.modalController.dismiss(client);
    }

    selectClient(id: string) {
        this.selectedClientId = id;
    }

    addClient() {
        const data = {
            types: this.types
        };
        DialogHelper.openDialog(this.modalController, SaisieLibreClientComponent, data)
            .then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.addClientService(result);
                }
            });
    }

    //#endregion

}
