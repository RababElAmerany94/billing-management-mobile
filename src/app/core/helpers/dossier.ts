import { SubSink } from 'subsink';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { ToastService, ToastTypes } from '../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IDossierModel, IDossier } from 'src/app/pages/dossier/dossier.model';
import { ResultStatus } from '../enums/result-status';
import { DossierStatus } from '../enums/dossier-status.enums';

export class DossierHelper {

    public static subs = new SubSink();

    static CheckReferenceIsUnique(
        dossierService: DossierService,
        toastService: ToastService,
        dossierModel: IDossierModel,
        translate: TranslateService,
        dossier: IDossier,
        isAdd: boolean, callback) {
        this.subs.sink = dossierService.IsUniqueReference(dossierModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed && !result.value &&
                (isAdd ? true : dossier.reference !== dossierModel.reference)) {
                toastService.presentToast({
                    message: translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'), type: ToastTypes.Danger
                });
                callback(false);
                return;
            }
            callback(true);
            return;
        }, _ => callback(false));
    }

    static canAssigne(status: DossierStatus) {
        return [DossierStatus.Assigne, DossierStatus.EnAttente, DossierStatus.EnRetard].includes(status);
    }
}
