import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { PrecariteType } from 'src/app/core/enums/precarite.enums';
import { TypeTravaux } from 'src/app/core/enums/type-travaux.enum';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ChampSiteInstallationService } from 'src/app/core/services/champ-site-installation.service';
import { IClient, IClientModel } from 'src/app/pages/clients/client.model';
import { BaseDocumentsComponent } from '../base-features/base-documents.component';

@Component({
    selector: 'app-info-site-installation',
    templateUrl: './info-site-installation.component.html'
})
export class InfoSiteInstallationComponent extends BaseDocumentsComponent<IClientModel> implements OnInit {

    @Output()
    informationsSupplementaireEvent = new EventEmitter<{ [key: string]: string; }>();

    @Input()
    informationsSupplementaire: { [key: string]: string; };

    @Input()
    showInformationsSupplementaire = false;

    @Input()
    readOnly = false;

    @Input()
    set primeCee(value: IClient) {
        this.selectedPrimeCee = value;
    }

    selectedPrimeCee: IClient;
    clientType = ClientType;
    precarite: IDropDownItem<number, string>[] = [];
    typeTravaux: IDropDownItem<number, string>[] = [];
    champsForm = this.fb.group({});
    champs = [];

    constructor(
        private service: ChampSiteInstallationService,
        public modalController: ModalController,
        public navCtrl: NavController,
        public router: Router,
        public location: Location,
        private fb: FormBuilder,
    ) {
        super(modalController, navCtrl, router, location);
    }

    ngOnInit() {
        this.chargeDropDownClientTypeTravaux();
        this.chargeDropDownClientPrecarite();
        this.getChampsSiteInstallation();
    }

    getChampsSiteInstallation() {
        this.service.GetAll().subscribe(result => {
            this.champs = result.value.map(e => e.name.trim());
            this.champs.forEach(item => {
                this.champsForm.addControl(item.trim(), this.fb.control({ value: this.getOldValue(item), disabled: this.readOnly }, []));
            });
            this.subscribeChanges();
        });
    }

    chargeDropDownClientPrecarite() {
        this.precarite = ConversionHelper.convertEnumToListKeysValues(PrecariteType, 'number');
        this.precarite.forEach(e => e.text = `PRECARITE_TYPE.${e.value}`);
    }

    chargeDropDownClientTypeTravaux() {
        this.typeTravaux = ConversionHelper.convertEnumToListKeysValues(TypeTravaux, 'number');
        this.typeTravaux.forEach(e => e.text = `TYPE_TRAVAUX.${e.value}`);
    }

    /**
     * subscribe changes
     */
    subscribeChanges() {
        this.champsForm
            .valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(values => {
                this.informationsSupplementaireEvent.emit(values);
            });
    }

    /**
     * get old value of champ
     */
    getOldValue(key: string) {
        if (this.informationsSupplementaire == null) {
            return '';
        }

        const index = Object.keys(this.informationsSupplementaire).findIndex(e => e.toLowerCase().trim() === key.toLowerCase().trim());
        return Object.values(this.informationsSupplementaire)[index];
    }

}
