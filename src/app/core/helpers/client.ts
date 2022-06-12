import { IClientModel, IClient } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { SubSink } from 'subsink';
import { ToastService, ToastTypes } from '../services/toast.service';
import { ResultStatus } from '../enums/result-status';
import { TranslateService } from '@ngx-translate/core';

export class ClientHelper {

    public static subs = new SubSink();

    static CheckReferenceIsUnique(
        clientService: ClientsService,
        toastService: ToastService,
        clientModel: IClientModel,
        translate: TranslateService,
        client: IClient,
        isAdd: boolean, callback) {
        this.subs.sink = clientService.IsUniqueReference(clientModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed && !result.value &&
                (isAdd ? true : client.reference !== clientModel.reference)) {
                toastService.presentToast({
                    message: translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'), type: ToastTypes.Danger
                });
                callback(false);
                return;
            }
            callback(true);
        });
    }
}
