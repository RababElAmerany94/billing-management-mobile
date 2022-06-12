import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RemiseType } from 'src/app/core/enums/remise-type.enum';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ICalculation, CalculationToken } from 'src/app/core/helpers/calculation/icalculation';
import { TranslateService } from '@ngx-translate/core';
import { NumberHelper } from 'src/app/core/helpers/number';
import { NavParams, ModalController } from '@ionic/angular';
import { IArticle } from 'src/app/core/models/general/article.model';
import { ToastTypes, ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['../../../../assets/components/input.scss']
})

export class DetailsArticleComponent implements OnInit {

    /** formGroup */
    form: FormGroup;

    /** the list of remise types */
    remiseType: IDropDownItem<number, string>[] = [];

    constructor(
        @Inject(CalculationToken)
        private calculation: ICalculation,
        private fb: FormBuilder,
        private navParams: NavParams,
        private modalController: ModalController,
        private toastService: ToastService,
        private translate: TranslateService) {
        this.initComponent(this.navParams.get('remiseTypes'), this.navParams.get('article'));
    }

    ngOnInit() { }

    //#region form

    /**
     * init form
     */
    initForm() {
        this.form = this.fb.group({
            qte: [1, [Validators.required]],
            reference: [0, [Validators.required]],
            tva: [20, [Validators.required]],
            prixAchat: [0],
            prixHT: [0, [Validators.required]],
            description: [null],
            designation: [null, [Validators.required]],
            unite: [null],
            fournisseurId: [null],
            prixTTC: [0],
            remise: [0, [Validators.required]],
            remiseType: [RemiseType.Percent, [Validators.required]]
        });
    }

    /**
     * set data in form
     */
    setDataForm(article: IArticle) {
        this.form.setValue({
            fournisseurId: article.hasOwnProperty('fournisseurId') ? article.fournisseurId : null,
            qte: article.qte,
            reference: article.reference,
            tva: article.tva,
            prixAchat: article.hasOwnProperty('prixAchat') ? article.prixAchat : 0,
            prixHT: article.prixHT,
            description: article.description,
            designation: article.designation,
            unite: article.unite,
            prixTTC: this.calculation.priceTTC(article.prixHT, article.tva),
            remise: article.remise,
            remiseType: article.remiseType
        });
    }

    /** initialization component */

    initComponent(remiseType: IDropDownItem<number, string>[], article: IArticle) {
        this.remiseType = remiseType;
        this.initForm();
        this.subscribePrixHt();
        this.subscribePrixTTC();
        this.subscribePrixTVA();
        if (article != null) {
            this.setDataForm(article);
        }
    }

    //#endregion

    //#region subscription change value

    /**
     * subscribe change prix HT
     */
    subscribePrixHt() {
        const prix = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(prix);
    }

    /**
     * subscribe change prix TTC
     */
    subscribePrixTTC() {
        const prix = this.calculation.priceHT(this.getPrixTTC(), this.getTva());
        this.form.get('prixHT').setValue(prix);
    }

    /**
     * subscribe change prix TVA
     */
    subscribePrixTVA() {
        const prixTTC = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(prixTTC);
    }

    /**
     * get TVA from FORM
     */
    getTva() {
        const tva = this.form.get('tva').value;
        return NumberHelper.stringToFloat(tva);
    }

    /**
     * get prix TTC from FORM
     */
    getPrixTTC() {
        const prixTTC = this.form.get('prixTTC').value;
        return NumberHelper.stringToFloat(prixTTC);
    }

    /**
     * get prix HT from FORM
     */
    getPrixHT() {
        const prixHT = this.form.get('prixHT').value;
        return NumberHelper.stringToFloat(prixHT);
    }

    /**
     *  close modal
     */
    dismiss() {
        this.modalController.dismiss();
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            this.modalController.dismiss(this.form.getRawValue());
        } else {
            this.toastService.presentToast(
                { message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    //#endregion

}
