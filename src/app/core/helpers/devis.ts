import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from '../enums/result-status';
import { DevisStatus } from '../enums/devis-status.enum';
import { ICalculation } from './calculation/icalculation';
import { FactureType } from '../enums/facture-type.enum';
import { DevisService } from 'src/app/pages/devis/devis.service';
import { ToastService, ToastTypes } from '../services/toast.service';
import { IDevisModel, IDevis } from 'src/app/pages/devis/devis.model';

export class DevisHelper {

    public static subs = new SubSink();

    static CheckReferenceIsUnique(
        devisService: DevisService,
        toastService: ToastService,
        devisModel: IDevisModel,
        translate: TranslateService,
        devis: IDevis,
        isAdd: boolean, callback) {
        this.subs.sink = devisService.IsUniqueReference(devisModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed && !result.value &&
                (isAdd ? true : devis.reference !== devisModel.reference)) {
                toastService.presentToast({
                    message: translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'), type: ToastTypes.Danger
                });
                callback(false);
                return;
            }
            callback(true);
        });
    }
    static canEdit(status: DevisStatus) {
        return ![DevisStatus.Signe, DevisStatus.Facture].includes(status);
    }

    /**
     * can transfer devis to facture
     * @param status the status of devis
     */
    static canTransferToFacture(status: DevisStatus): boolean {
        return [DevisStatus.Signe, DevisStatus.Valider].includes(status);
    }

    /**
     * can marked devis perdu with the given status
     * @param status the status of devis
     */
    static canMarkedPerdu(status: DevisStatus) {
        return [DevisStatus.Encours, DevisStatus.Enretard].includes(status);
    }

    /**
     * can sign devis with the given status
     * @param status the status of devis
     */
    static canSigne(status: DevisStatus) {
        return [DevisStatus.Encours, DevisStatus.Valider, DevisStatus.Enretard].includes(status);
    }

    /**
     * percent of facturation devis
     * @param calculation the class of calculation
     * @param devis the devis to calculate percent
     */
    static percentFacturationDevis(calculation: ICalculation, devis: IDevis): number {
        if (devis.factures != null && devis.factures.every(e => e.facture.type === FactureType.Acompte)) {
            return calculation.percentAvancementDevis(devis.factures, devis.totalTTC);
        } else {
            return null;
        }
    }
}
