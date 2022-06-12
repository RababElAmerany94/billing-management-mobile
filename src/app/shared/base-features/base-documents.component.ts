import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { RemiseType } from 'src/app/core/enums/remise-type.enum';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { UserHelper } from 'src/app/core/helpers/user';
import { IArticle } from 'src/app/core/models/general/article.model';
import { IResultCalculationModel } from 'src/app/core/models/general/calculation.model';
import { IClient } from 'src/app/pages/clients/client.model';
import { SubSink } from 'subsink';
import { SendEmailComponent } from '../send-email/send-email.component';

@Component({
    selector: 'app-base-documents',
    template: ``
})
export class BaseDocumentsComponent<IModel> implements OnDestroy {

    subs = new SubSink();

    /** add event */
    @Output()
    addEvent = new EventEmitter<IModel>();

    /** edit event */
    @Output()
    editEvent = new EventEmitter<IModel>();

    /** cancel event */
    @Output()
    cancelEvent = new EventEmitter();

    /** download devis event */
    @Output()
    downloadEvent = new EventEmitter();

    /** print pdf devis */
    @Output()
    printPdfEvent = new EventEmitter();

    /** send email event */
    @Output()
    SendEmailEvent = new EventEmitter();

    /** the mode of component */
    @Input()
    mode: ModeEnum;

    /** the form group */
    @Input()
    form: FormGroup;

    /** is navigation route */
    @Input()
    isNavigationRoute = false;

    /** an enumeration define list of roles */
    userRole = UserProfile;

    /** list of articles */
    articles: IArticle[] = [];

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** type of remise */
    remiseType = RemiseType.Percent;

    /** remise */
    remise = 0;

    /** current selected client */
    selectedClient: IClient;

    modes = ModeEnum;

    constructor(
        public modalController: ModalController,
        public navCtrl: NavController,
        public router: Router,
        public location: Location,
    ) { }


    // #region view helpers
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    userId = () => UserHelper.getUserId();
    // #endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    /** display header title */
    displayHeaderTitle() {
        switch (true) {
            case this.isAddMode():
                return 'ADD.TITLE';

            case this.isEditMode():
                return 'EDIT.TITLE';

            case this.isShowMode():
                return 'SHOW.TITLE';

            default:
                break;
        }
    }

    //#region shared modal controller

    /**
     * open send email dialog
     */
    async sendEmail(data: any, callback = null) {
        DialogHelper.openDialog(this.modalController, SendEmailComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                callback(result);
            }
        });
    }

    //#endregion

    //#region events

    /**
     * download pdf
     */
    downloadPdf(id?: number) {
        this.downloadEvent.emit(id);
    }

    /**
     * print pdf
     */
    printPdf(id?: number) {
        this.printPdfEvent.emit(id);
    }

    /**
     * cancel edit
     */
    cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.cancelEvent.emit();
        }
    }

    //#endregion


    //#region setters

    /**
     * set result calculation
     */
    setResultCalculation(resultCalculation: IResultCalculationModel) {
        this.resultCalculation = resultCalculation;
    }

    //#endregion

}
