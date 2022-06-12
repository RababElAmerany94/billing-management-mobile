import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AddressAndContactHelper } from 'src/app/core/helpers/address-and-contact';
import { UserHelper } from 'src/app/core/helpers/user';
import { ICommercialPlanning } from 'src/app/core/models/general/commercial-planning.model';
import { CheckUserAssignedSameDateAndHourFilterOption } from 'src/app/core/models/general/filter-option.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { SubSink } from 'subsink';
import { DialogHelper } from '../../../../core/helpers/dialog';
import { DossierService } from '../../dossier.service';

@Component({
    selector: 'app-validation-demande-rdv',
    templateUrl: './assign-commercial.component.html',
    styleUrls: ['../../../../../assets/components/input.scss'],
})
export class AssignCommercialComponent implements OnInit {

    subs = new SubSink();

    /** form group */
    form: FormGroup;

    /** the columns */
    columns: string[] = [];

    /** selected commercial */
    selectedCommercialPlanning: ICommercialPlanning;

    /** date rdv */
    dateRDV: Date;

    dossierId: string;

    isValider = false;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private dossierService: DossierService,
        private alertController: AlertController,
        private toastService: ToastService,
        public translate: TranslateService,
        private navParams: NavParams) {
        const dateRDV = this.navParams.get('dateRDV');
        const commercialId = this.navParams.get('commercialId');
        this.dossierId = this.navParams.get('dossierId');
        this.isValider = this.navParams.get('isValider');
        this.initializeForm();
        this.initData(dateRDV, commercialId);
    }

    ngOnInit() {
        this.initColumns();
        this.subscribeChangesDateRDV();
    }

    /**
     * init form
     */
    initializeForm() {
        this.form = this.fb.group({
            dateRDV: [null, [Validators.required]],
            commercialId: this.isValider ? [null] : [null, [Validators.required]]
        });
    }

    /**
     * init data
     */
    initData(dateRDV, commercialId) {
        if (dateRDV != null || commercialId != null) {
            this.dateRDV = dateRDV;
            this.form.patchValue({
                dateRDV,
                commercialId
            });
        }
    }

    /**
     * subscribe changes of control date rdv
     */
    subscribeChangesDateRDV() {
        this.subs.sink = this.form.get('dateRDV').valueChanges.pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(result => {
                this.dateRDV = result;
                this.selectedCommercialPlanning = null;
                this.form.get('commercialId').setValue(null);
            });
    }

    /**
     * set commercial planning
     */
    setCommercialPlanning(commercialsPlanning: ICommercialPlanning) {
        this.selectedCommercialPlanning = commercialsPlanning;
    }

    /**
     * display default address
     */
    getDefaultAddress(addresses: string) {
        return AddressAndContactHelper.getAddress(addresses);
    }

    /**
     * display default contact
     */
    getDefaultContact(contact: string) {
        return AddressAndContactHelper.buildPhraseContact(AddressAndContactHelper.getContact(contact));
    }

    /**
     * initialize columns
     */
    initColumns() {
        this.columns = [
            'LABELS.CLIENT',
            'LABELS.HEURE',
            'ADDRESS.TITLE',
            'ADDRESS.VILLE',
            'ADDRESS.CODE_POSTAL',
            'CONTACTS.TITLE',
        ];
    }

    /** dismiss modal  */
    Dismiss() {
        this.modalController.dismiss();
    }

    /** save  */
    async save() {
        if (this.form.valid) {
            const filterOption: CheckUserAssignedSameDateAndHourFilterOption = {
                dateRdv: this.form.get('dateRDV').value,
                userId: !this.isValider ? this.form.get('commercialId').value : UserHelper.getUserId(),
                excludeDossierId: this.dossierId
            };
            this.checkUserAssignedSameDateAndHour(filterOption, () => {
                const values = {
                    dateRDV: this.dateRDV,
                    commercialId: !this.isValider ? this.selectedCommercialPlanning.id : UserHelper.getUserId(),
                };
                this.modalController.dismiss(values);
            });
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    /**
     * check user already assigned to another dossier in the same date and hour
     */
    checkUserAssignedSameDateAndHour(filterOption: CheckUserAssignedSameDateAndHourFilterOption, success: () => void): void {
        this.dossierService.CheckUserAssignedSameDateAndHour(filterOption).subscribe(result => {
            if (result.value) {
                DialogHelper.presentAlert(
                    this.alertController,
                    this.translate,
                    {
                        headerText: this.translate.instant('LABELS.CONFIRMATION'),
                        message: this.translate.instant('CHECK_USER_ASSIGNED_SAME_DATE_AND_HOUR.QUESTION'),
                        done: async () => {
                            success();
                        },
                        cancel: () => { }
                    }
                );
            } else {
                success();
            }
        });
    }

}
