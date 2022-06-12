import { TranslateService } from '@ngx-translate/core';
import { IBonCommande, IBonCommandeModel } from 'src/app/pages/bon-commande/bon-commande.model';
import { BonCommandeService } from 'src/app/pages/bon-commande/bon-commande.service';
import { SubSink } from 'subsink';
import { BonCommandeStatus } from '../enums/bon-commande-status.enum';
import { ResultStatus } from '../enums/result-status';
import { ToastService, ToastTypes } from '../services/toast.service';

export class BonCommandeHelper {

    public static subs = new SubSink();

    static CheckReferenceIsUnique(
        bonCommandeService: BonCommandeService,
        toastService: ToastService,
        bonCommandeModel: IBonCommandeModel,
        translate: TranslateService,
        bonCommande: IBonCommande,
        isAdd: boolean, callback) {
        this.subs.sink = bonCommandeService.IsUniqueReference(bonCommandeModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed && !result.value &&
                (isAdd ? true : bonCommande.reference !== bonCommandeModel.reference)) {
                toastService.presentToast({
                    message: translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'), type: ToastTypes.Danger
                });
                callback(false);
                return;
            }
            callback(true);
        });
    }

    static canEditOrDelete(status: BonCommandeStatus) {
        return ![BonCommandeStatus.Commande].includes(status);
    }

    /**
     * can sign devis with the given status
     * @param status the status of devis
     */
    static canSigne(status: BonCommandeStatus) {
        return [BonCommandeStatus.EnCours].includes(status);
    }

    /**
     * can dossier be cancel
     */
    static canAnnuler(status: BonCommandeStatus) {
        return [BonCommandeStatus.Annule, BonCommandeStatus.Commande].includes(status);
    }

    /**
     * can be transfere to a devis
     */
    static canTransferToDevis(status: BonCommandeStatus) {
        return ![BonCommandeStatus.Annule, BonCommandeStatus.Commande].includes(status);
    }
}
