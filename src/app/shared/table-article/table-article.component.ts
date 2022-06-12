import { Component, Output, Input, EventEmitter, Inject } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { SelectArticleComponent } from './select-article/select-article.component';
import { SubSink } from 'subsink';
import { IResultCalculationModel, IInputTableArticleComponent } from 'src/app/core/models/general/calculation.model';
import { IArticle } from 'src/app/core/models/general/article.model';
import { ArticleType } from 'src/app/core/enums/article-type.enum';
import { RemiseType } from 'src/app/core/enums/remise-type.enum';
import { ArrayHelper } from 'src/app/core/helpers/array';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { CalculationToken, ICalculation } from 'src/app/core/helpers/calculation/icalculation';
import { ObjectHelper } from 'src/app/core/helpers/object';
import { NumberHelper } from 'src/app/core/helpers/number';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { StringHelper } from 'src/app/core/helpers/string';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { PopoverComponent } from '../popover/popover.component';
import { TranslateService } from '@ngx-translate/core';
import { DetailsArticleComponent } from './details/details.component';
import { IDropDownItem } from '../../core/models/general/drop-down-item.model';
import { AppSettings } from '../../app-settings/app-settings';

/**
 * the type of table articles
 */
export enum TableArticleMode {
    Normal = 1,
    Euro = 2,
    Reduction = 3
}

@Component({
    selector: 'app-table-article',
    templateUrl: './table-article.component.html',
    styleUrls: ['../memo/add-memo/add-memo.component.scss']
})
export class TableArticleComponent {

    subs = new SubSink();

    /** in change event */
    @Output()
    changeEvent = new EventEmitter<IResultCalculationModel>();

    /** the current select articles */
    @Input()
    set data(data: IInputTableArticleComponent) {
        if (data != null) {
            this.articles = ObjectHelper.isNullOrUndefined(data.articles) ? [] : data.articles;
            this.mode = data.mode != null ? data.mode : TableArticleMode.Normal;
            this.setFormControlTotalReductionValue((NumberHelper.isNullOrNaN(data.totalReduction) ? 0 : data.totalReduction));
            this.doCalculation(true);
            this.updateStatusFormControlTotalReduction();
        }
    }

    /** the current select articles */
    @Input()
    set Articles(articles: IArticle[]) {
        if (articles != null) {
            this.articles = articles;
            this.doCalculation();
        }
    }

    /** type of remise */
    @Input()
    remiseType = RemiseType.Percent;

    /** the list of remise type */
    remiseTypes: IDropDownItem<number, string>[] = [];

    /** the read only mode */
    @Input()
    readOnly = false;

    /** remise */
    @Input()
    remise = 0;

    /** test if products articles or prestations articles */
    @Input()
    isProduitArticle = false;

    /** title */
    @Input()
    title = 'LABELS.ARTICLES';

    /** is more detail article */
    @Input()
    moreDetailArticle = false;

    /** the form totals */
    formTotals: FormGroup;

    /** list articles */
    articles: IArticle[] = [];

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** the current mode of component */
    mode: TableArticleMode = TableArticleMode.Normal;

    /** the modes of table article */
    modes: typeof TableArticleMode = TableArticleMode;

    /** total ttc form control */
    formControlTotalTTC = new FormControl();

    /** enumeration of type articles */
    articleType = ArticleType;

    constructor(
        private fb: FormBuilder,
        public modalController: ModalController,
        private translate: TranslateService,
        public alertController: AlertController,
        public popoverCtrl: PopoverController,
        @Inject(CalculationToken) private calculation: ICalculation
    ) {
        this.initForm();
        this.subscribeFormRemise();
        this.subscribeFormControlTotalTTC();
        this.getRemiseType();
    }

    /**
     * init form
     */
    initForm() {
        this.formTotals = this.fb.group({
            remise: [0],
            remiseType: [RemiseType.Percent],
            totalReduction: [0]
        });
    }

    /**
     * subscribe form remise
     */
    subscribeFormRemise() {
        this.subs.sink = this.formTotals.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(_ => {
                this.remise = this.formTotals.value.remise;
                this.remiseType = this.formTotals.value.remiseType;
                this.doCalculation();
            });
    }

    /**
     * subscribe form control of total TTC
     */
    subscribeFormControlTotalTTC() {
        this.subs.sink = this.formControlTotalTTC.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(value => {
                this.updateCalculationOnChangeTotalTTC(NumberHelper.stringToFloat(value));
            });
    }

    /**
     * open choice type articles
     */
    async openChoiceTypeArticles() {

        if (this.mode === this.modes.Normal) {
            this.openSelectArticles(ArticleType.Produit);
            return;
        }

        const popover = await this.popoverCtrl.create({
            component: PopoverComponent,
            componentProps: {
                items: [
                    {
                        text: this.translate.instant('LABELS.ARTICLES'),
                        icon: 'create-outline',
                        action: () => this.openSelectArticles(ArticleType.Produit),
                        appear: true
                    },
                    {
                        text: this.translate.instant('LABELS.ARTICLES_SPECIAL'),
                        icon: 'ellipsis-horizontal-outline',
                        action: () => this.openSelectArticles(ArticleType.SpecialArticle),
                        appear: true
                    }
                ]
            },
            event,
            translucent: false
        });

        return await popover.present();
    }

    /**
     * open select articles base type
     */
    openSelectArticles(type: ArticleType) {
        const data = { articles: this.articles, type };
        DialogHelper.openDialog(this.modalController, SelectArticleComponent, data).then(result => {
            if (!ArrayHelper.isEmptyOrNull(result)) {
                this.articles = result;
                this.articles.sort((a, b) => a.type - b.type);
                this.doCalculation();
            }
        });
    }

    //#region helpers

    /**
     * do the calculation of article
     */
    doCalculation(updateTotalTtcForm = true) {
        switch (this.mode) {
            case TableArticleMode.Normal:
                this.resultCalculation = this.calculation
                    .calculationGenerale(this.articles, this.remise, this.remiseType);
                break;

            case TableArticleMode.Reduction:
                this.resultCalculation = this.calculation
                    .calculationGeneraleWithReduction(this.articles, this.getTotalReduction(), this.remise, this.remiseType);
                if (updateTotalTtcForm) {
                    this.setFormControlTotalTTCValue(this.resultCalculation.totalTTC);
                }
                break;

            case TableArticleMode.Euro:
                this.resultCalculation = this.calculation
                    .calculationGeneraleWithPaid(this.articles, 1, this.remise, this.remiseType);
                if (updateTotalTtcForm) {
                    this.setFormControlTotalTTCValue(this.resultCalculation.totalTTC);
                }
                break;
        }
        this.changeEvent.emit(this.resultCalculation);
    }

    /**
     * get total of reduction
     */
    getTotalReduction(): number {
        if (this.formTotals == null) { return 0; }
        const value = this.formTotals.get('totalReduction').value;
        if (!StringHelper.isEmptyOrNull(value)) {
            return parseFloat(value);
        } else {
            return 0;
        }
    }

    /**
     * set value in form control TTC
     */
    setFormControlTotalTTCValue(value: number) {
        this.formControlTotalTTC.setValue(NumberHelper.roundingNumber(value));
    }

    /**
     * set value in form control TTC
     */
    setFormControlTotalReductionValue(value: number) {
        this.formTotals.get('totalReduction').setValue(NumberHelper.roundingNumber(value));
    }

    /**
     * update status form control total reduction status (enabled or disabled)
     */
    updateStatusFormControlTotalReduction() {
        if (this.mode === TableArticleMode.Reduction) {
            this.formTotals.get('totalReduction').enable();
        } else {
            this.formTotals.get('totalReduction').disable();
        }
    }

    /**
     * update calculation on change total ttc
     */
    updateCalculationOnChangeTotalTTC(totalTTC: number) {
        const calculationTva = this.resultCalculation != null ? this.resultCalculation.calculationTva : [];
        this.articles = this.calculation.reverseCalculate(totalTTC, this.articles, calculationTva).articles;
        this.doCalculation(false);
    }

    /**
     * is total TTC modifiable
     */
    isEditTotalTTC(): boolean {
        return this.mode !== this.modes.Normal && !this.readOnly;
    }

    /**
     * delete article by index
     * @param index the index of article in the list articles
     */
    deleteArticle(index: number) {
        const article = this.articles[index];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('TABLE_ARTICLE.DELETE.HEADER'),
                message: this.translate.instant('TABLE_ARTICLE.DELETE.MESSAGE') + ':' + article.designation + ' ? ',
                done: async () => {
                    this.articles.splice(index, 1);
                    this.doCalculation();
                },
                cancel: () => {
                }
            });
    }

    /** detail article */
    detailArticle(index: number) {
        const article = this.articles[index];
        const data = { article, remiseType: this.remiseTypes };
        DialogHelper.openDialog(this.modalController, DetailsArticleComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.articles[index] = { ...article, ...result };
                this.doCalculation();
            }
        });

    }

    /**
     * get remise as IDropDown
     */
    getRemiseType() {
        this.remiseTypes = [
            { value: RemiseType.Currency, text: AppSettings.CURRENCY },
            { value: RemiseType.Percent, text: '%' }
        ];
    }
    //#endregion
}
