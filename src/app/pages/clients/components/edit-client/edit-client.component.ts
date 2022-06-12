import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';
import { StringHelper } from 'src/app/core/helpers/string';
import { Address } from 'src/app/core/models/general/address.model';
import { IClientRelationModel } from 'src/app/core/models/general/client-relation.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { BaseEditComponent } from 'src/app/shared/base-features/base-edit.component';
import { GenreClient } from '../../../../core/enums/genre-client.enum';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { IClient, IClientModel } from '../../client.model';

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: [
        '../../../../../assets/components/input.scss',
        '../../../../../assets/components/grid.scss'
    ],
})
export class EditClientComponent extends BaseEditComponent<IClientModel> implements OnInit {

    @Input()
    set client(client: IClient) {
        if (client != null) {
            this.selectedClient = client;
            this.contacts = client.contacts as IContact[];
            this.address = client.addresses as Address[];
            this.relations = client.relations;
        }
    }

    @Input()
    clientType: IDropDownItem<number, string>[] = [];

    genreClient: IDropDownItem<number, string>[] = [];

    selectedClient: IClient;
    address: Address[] = [];
    contacts: IContact[] = [];
    relations: IClientRelationModel[] = [];

    /** userProfile type */
    userProfile: typeof UserProfile = UserProfile;

    constructor(
        private location: Location,
        private numerationService: NumerotationService,
    ) {
        super();
    }

    ngOnInit() {
        this.chargeDropDownGenreClient();
    }

    /**
     * build client object
     */
    buildClientObject(): IClientModel {
        const clientModel: IClientModel = { ...this.form.getRawValue() };
        clientModel.addresses = this.address;
        clientModel.contacts = this.contacts;
        clientModel.relations = this.relations;
        clientModel.primeCEEId = !StringHelper.isEmptyOrNull(this.form.get('primeCEEId').value) ? this.form.get('primeCEEId').value : null;
        return clientModel;
    }

    /**
     * save client
     */
    save() {

        if (this.form.get('type').value === ClientType.Obliges) {
            this.form.get('genre').setValue(GenreClient.Client);
        }

        if (this.form.valid) {
            if (this.isAddMode()) {
                this.addEvent.emit(this.buildClientObject());
            } else {
                this.editEvent.emit(this.buildClientObject());
            }
        } else {
            this.form.markAllAsTouched();
        }

    }

    setAddress(address: Address[]) {
        if (address) {
            this.address = address;
        }
    }

    setContact(contact: IContact[]) {
        this.contacts = contact;
    }

    generateCodeComptable() {
        this.form.get('codeComptable').setValue(
            (StringHelper.isEmptyOrNull(this.form.controls.firstName.value) ? '' : this.form.controls.firstName.value.replace(/ /g, ''))
        );
    }

    getClientType = () => this.form.get('type').value;
    isClientParticulier = () => parseInt(this.getClientType(), 10) === ClientType.Particulier;
    isClientOblige = () => parseInt(this.getClientType(), 10) === ClientType.Obliges;
    isClientProfessionnel = () => parseInt(this.getClientType(), 10) === ClientType.Professionnel;

    chargeDropDownGenreClient() {
        this.genreClient = ConversionHelper.convertEnumToListKeysValues(GenreClient, 'number');
        this.genreClient.forEach(e => e.text = `GENRE_CLIENT.${e.value}`);
    }

    cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.cancelEvent.emit();
        }
    }

    displayTitle() {
        return this.isNavigationRoute && this.isShowMode() ?
            'SHOW.TITLE' :
            this.displayHeaderTitle();
    }

    /**
     * set client relation
     */
    setClientRelation(relations: IClientRelationModel[]) {
        if (relations) {
            this.relations = relations;
        }
    }

    generateReferenceClient() {
        if (this.isAddMode()) {
            let type: NumerationType;

            if (this.isClientProfessionnel()) {
                type = NumerationType.CLIENT_PROFESSIONNEL;
            } else if (this.isClientParticulier()) {
                type = NumerationType.CLIENT_PARTICULIER;
            } else if (this.isClientOblige()) {
                type = NumerationType.CLIENT_OBLIGES;
            }

            if (type != null) {
                this.numerationService.GenerateNumerotation(type).subscribe(item => {
                    if (item.status === ResultStatus.Succeed) {
                        this.form.get('reference').setValue(item.value);
                    }
                });
            } else {
                this.form.get('reference').setValue('');
            }
        }
    }

}
