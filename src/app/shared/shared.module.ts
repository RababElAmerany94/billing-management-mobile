import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicRatingModule } from 'ionic4-rating';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TagInputModule } from 'ngx-chips';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { QuillModule } from 'ngx-quill';
import { DirectiveModule } from '../directives/directive.module';
import { PipesModule } from '../pipes/pipes.module';
import { InfoSiteInstallationComponent } from '../shared/info-site-installation/info-site-installation.component';
import { AddAddressComponent } from './address/add-address/add-address.component';
import { AddressComponent } from './address/address.component';
import { BaseContainerComponent } from './base-features/base-container.component';
import { BaseDocumentsComponent } from './base-features/base-documents.component';
import { BaseEditComponent } from './base-features/base-edit.component';
import { BaseListComponent } from './base-features/base-list.component';
import { CollabsibleFormComponent } from './collabsible-form/collabsible-form.component';
import { AddContactComponent } from './contacts/add-contact/add-contact.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DataListComponent } from './data-list/data-list.component';
import { SelectAgencesComponent } from './data-selectors/select-agences/select-agences.component';
import { SelectClientsComponent } from './data-selectors/select-clients/select-clients.component';
import { SelectDepartementComponent } from './data-selectors/select-departement/select-departement.component';
import { SelectDossiersComponent } from './data-selectors/select-dossiers/select-dossiers.component';
import { SelectUsersComponent } from './data-selectors/select-users/select-users.component';
import { DossierPvComponent } from './dossier-pv/dossier-pv.component';
import { EditDossierPvComponent } from './dossier-pv/edit-dossier-pv/edit-dossier-pv.component';
import { ConstatComblesComponent } from './dossier-pv/fiche-controle/constat-combles/constat-combles.component';
import { ConstatMursComponent } from './dossier-pv/fiche-controle/constat-murs/constat-murs.component';
import { ConstatPlanchersComponent } from './dossier-pv/fiche-controle/constat-planchers/constat-planchers.component';
import { FicheControleTabsComponent } from './dossier-pv/fiche-controle/fiche-controle-tabs/fiche-controle-tabs.component';
import { FicheControleComponent } from './dossier-pv/fiche-controle/fiche-controle.component';
import { InformationFicheControleComponent } from './dossier-pv/fiche-controle/information-fiche-controle/information-fiche-controle.component';
import { SignFicheControleComponent } from './dossier-pv/fiche-controle/sign-fiche-controle/sign-fiche-controle.component';
import { HeaderComponent } from './header/header.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AddMemoComponent } from './memo/add-memo/add-memo.component';
import { MemoComponent } from './memo/memo.component';
import { PopoverComponent } from './popover/popover.component';
import { AddRelationClientComponent } from './relation-client/add-relation-client/add-relation-client.component';
import { RelationClientComponent } from './relation-client/relation-client.component';
import { SaisieLibreClientComponent } from './saisie-libre-client/saisie-libre-client.component';
import { SaisieLibreDossierComponent } from './saisie-libre-dossier/saisie-libre-dossier.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { SharedDetailsComponent } from './shared-details/shared-details.component';
import { AddDevisDocAssociateComponent } from './shared-related/add-devis-doc-associate/add-devis-doc-associate.component';
import { SharedRelatedDocsComponent } from './shared-related/shared-related-docs/shared-related-docs.component';
import { SharedRelatedDocumentComponent } from './shared-related/shared-related-document/shared-related-document.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
import { DetailsArticleComponent } from './table-article/details/details.component';
import { SelectArticleComponent } from './table-article/select-article/select-article.component';
import { TableArticleComponent } from './table-article/table-article.component';
import { TabsDetailComponent } from './tabs-detail/tabs-detail.component';
import { TakePictureModalComponent } from './take-pictures/take-picture-modal/take-picture-modal.component';
import { TakePicturesComponent } from './take-pictures/take-pictures.component';
import { BaseUiCustomComponent } from './ui-ionic-composant/base-ui-custom.component';
import { CustomCheckboxComponent } from './ui-ionic-composant/custom-checkbox/custom-checkbox.component';
import { CustomDateTimeComponent } from './ui-ionic-composant/custom-date-time/custom-date-time.component';
import { AddressDropdownComponent } from './ui-ionic-composant/custom-dropdowns/address-dropdown/address-dropdown.component';
import { AgendaEvenementDropdownComponent } from './ui-ionic-composant/custom-dropdowns/agenda-evenement-dropdown/agenda-evenement-dropdown.component';
import { BankAccountDropdownComponent } from './ui-ionic-composant/custom-dropdowns/bank-account-dropdown/bank-account-dropdown.component';
import { CategorieDocumentComponent } from './ui-ionic-composant/custom-dropdowns/categorie-document/categorie-document.component';
import { CommercialsPlanningDropdownComponent } from './ui-ionic-composant/custom-dropdowns/commercials-planing-dropdown/commercials-planing-dropdown.component';
import { ContactDropdownComponent } from './ui-ionic-composant/custom-dropdowns/contact-dropdown/contact-dropdown.component';
import { CountriesDropdownComponent } from './ui-ionic-composant/custom-dropdowns/countries-dropdown/countries-dropdown.component';
import { CustomDropDownComponent } from './ui-ionic-composant/custom-dropdowns/custom-drop-down/custom-drop-down.component';
import { DropdownTechnicienComponent } from './ui-ionic-composant/custom-dropdowns/dropdown-technicien/dropdown-technicien.component';
import { FournisseurDropdownComponent } from './ui-ionic-composant/custom-dropdowns/fournisseur-dropdown/fournisseur-dropdown.component';
import { ModeRegulationComponent } from './ui-ionic-composant/custom-dropdowns/mode-regulation/mode-regulation.component';
import { PrimeCeeDropdownComponent } from './ui-ionic-composant/custom-dropdowns/prime-cee-dropdown/prime-cee-dropdown.component';
import { TypeChauffageDropdownComponent } from './ui-ionic-composant/custom-dropdowns/type-chauffage-dropdown/type-chauffage-dropdown.component';
import { TypeLogementDropdownComponent } from './ui-ionic-composant/custom-dropdowns/type-logement-dropdown/type-logement-dropdown.component';
import { DropdownUniteComponent } from './ui-ionic-composant/custom-dropdowns/unite-dropdown/unite-dropdown.component';
import { CustomErrorDisplayComponent } from './ui-ionic-composant/custom-error-display/custom-error-display.component';
import { CustomInputComponent } from './ui-ionic-composant/custom-input/custom-input.component';
import { CustomTextareaComponent } from './ui-ionic-composant/custom-textarea/custom-textarea.component';
import { CustumEditorTextComponent } from './ui-ionic-composant/custum-editor-text/custum-editor-text.component';
import { CustumInputPasswordComponent } from './ui-ionic-composant/custum-input-password/custum-input-password.component';
import { PeriodComponent } from './ui-ionic-composant/period/period.component';
import { SelectAgenceComponent } from './ui-ionic-composant/select-agence/select-agence.component';
import { SelectClientComponent } from './ui-ionic-composant/select-client/select-client.component';
import { SelectDossierComponent } from './ui-ionic-composant/select-dossier/select-dossier.component';
import { SelectUserComponent } from './ui-ionic-composant/select-user/select-user.component';
import { ValidationDevisComponent } from './validation-devis/validation-devis.component';

@NgModule({
    declarations: [
        // custom ui components
        BaseUiCustomComponent,
        CustomInputComponent,
        CustomErrorDisplayComponent,
        CustumInputPasswordComponent,
        CustumEditorTextComponent,
        CustomTextareaComponent,
        CustomCheckboxComponent,
        CustomDateTimeComponent,
        CommercialsPlanningDropdownComponent,
        PopoverComponent,

        // custom header
        HeaderComponent,

        // custom search bar component
        SearchBarComponent,

        /** custom collabsible component */
        CollabsibleFormComponent,

        /** custum dropdowns */
        SelectUserComponent,
        CustomDropDownComponent,
        CountriesDropdownComponent,
        DropdownTechnicienComponent,
        PrimeCeeDropdownComponent,
        InfoSiteInstallationComponent,
        CommercialsPlanningDropdownComponent,
        AddressDropdownComponent,
        ModeRegulationComponent,
        BankAccountDropdownComponent,
        DropdownUniteComponent,
        FournisseurDropdownComponent,
        TypeLogementDropdownComponent,
        PeriodComponent,
        AgendaEvenementDropdownComponent,
        TypeChauffageDropdownComponent,

        /** components shared in application */
        ContactsComponent,
        CategorieDocumentComponent,
        AddDevisDocAssociateComponent,
        AddContactComponent,
        SharedRelatedDocumentComponent,
        ContactDropdownComponent,
        AddAddressComponent,
        AddressComponent,
        TabsDetailComponent,
        TableArticleComponent,
        SelectArticleComponent,
        HistoriqueComponent,
        SelectClientsComponent,
        SelectAgenceComponent,
        SelectAgencesComponent,
        DataListComponent,
        SharedDetailsComponent,
        SendEmailComponent,
        MemoComponent,
        AddMemoComponent,
        SaisieLibreClientComponent,
        DossierPvComponent,
        EditDossierPvComponent,
        TakePictureModalComponent,
        SignaturePadComponent,
        TakePicturesComponent,
        FicheControleComponent,
        ConstatComblesComponent,
        ConstatMursComponent,
        ConstatPlanchersComponent,
        InformationFicheControleComponent,
        FicheControleTabsComponent,
        SignFicheControleComponent,
        SelectUsersComponent,
        BaseEditComponent,
        BaseListComponent,
        BaseContainerComponent,
        BaseDocumentsComponent,
        SelectDepartementComponent,
        DetailsArticleComponent,
        ValidationDevisComponent,
        SharedRelatedDocsComponent,
        SelectDossiersComponent,
        SaisieLibreDossierComponent,
        SelectClientComponent,
        SelectDossierComponent,
        RelationClientComponent,
        AddRelationClientComponent
    ],
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        RouterModule,
        FormsModule,
        PipesModule,
        ReactiveFormsModule,
        IonicModule,
        ImageCropperModule,
        PdfViewerModule,
        PinchZoomModule,
        SignaturePadModule,
        IonicRatingModule,
        TagInputModule,
        QuillModule.forRoot(),
        NgxDocViewerModule,
        DirectiveModule,
    ],
    exports: [
        BaseUiCustomComponent,
        CustomInputComponent,
        CustomErrorDisplayComponent,
        CustumInputPasswordComponent,
        CustomTextareaComponent,
        CustomCheckboxComponent,
        CustomDateTimeComponent,
        CustumEditorTextComponent,
        PopoverComponent,
        SearchBarComponent,
        HeaderComponent,
        CommonModule,
        PipesModule,
        RouterModule,
        FormsModule,
        PdfViewerModule,
        PinchZoomModule,
        ImageCropperModule,
        ReactiveFormsModule,
        IonicModule,
        SignaturePadModule,
        TagInputModule,
        QuillModule,
        IonicRatingModule,
        DirectiveModule,

        /** custom dropdowns */
        SelectUserComponent,
        CustomDropDownComponent,
        CountriesDropdownComponent,
        SelectDepartementComponent,
        DropdownTechnicienComponent,
        CustomDropDownComponent,
        PrimeCeeDropdownComponent,
        InfoSiteInstallationComponent,
        CommercialsPlanningDropdownComponent,
        AddressDropdownComponent,
        ModeRegulationComponent,
        BankAccountDropdownComponent,
        TypeLogementDropdownComponent,
        PeriodComponent,
        AgendaEvenementDropdownComponent,
        TypeChauffageDropdownComponent,
        SelectAgencesComponent,
        SelectClientComponent,
        SelectDossierComponent,

        /** components shared */
        ContactsComponent,
        CategorieDocumentComponent,
        AddDevisDocAssociateComponent,
        ContactDropdownComponent,
        SharedRelatedDocumentComponent,
        AddContactComponent,
        AddAddressComponent,
        AddressComponent,
        TableArticleComponent,
        SelectArticleComponent,
        TabsDetailComponent,
        HistoriqueComponent,
        CollabsibleFormComponent,
        SelectClientsComponent,
        SelectAgenceComponent,
        DataListComponent,
        SharedDetailsComponent,
        SendEmailComponent,
        MemoComponent,
        AddMemoComponent,
        SaisieLibreClientComponent,
        DossierPvComponent,
        EditDossierPvComponent,
        TakePictureModalComponent,
        SignaturePadComponent,
        TakePicturesComponent,
        FicheControleComponent,
        ConstatComblesComponent,
        ConstatMursComponent,
        ConstatPlanchersComponent,
        InformationFicheControleComponent,
        FicheControleTabsComponent,
        SignFicheControleComponent,
        BaseEditComponent,
        BaseListComponent,
        BaseContainerComponent,
        BaseDocumentsComponent,
        ValidationDevisComponent,
        SharedRelatedDocsComponent,
        SelectDossiersComponent,
        SaisieLibreDossierComponent,
        RelationClientComponent,
        AddRelationClientComponent
    ],
    entryComponents: [
        AddContactComponent,
        AddAddressComponent,
        AddDevisDocAssociateComponent,
        SelectClientsComponent,
        SelectArticleComponent,
        SelectAgencesComponent,
        PopoverComponent,
        SendEmailComponent,
        AddMemoComponent,
        SaisieLibreClientComponent,
        EditDossierPvComponent,
        TakePictureModalComponent,
        FicheControleComponent,
        SignFicheControleComponent,
        FicheControleTabsComponent,
        SelectUsersComponent,
        SelectDepartementComponent,
        DetailsArticleComponent,
        ValidationDevisComponent,
        SelectDossiersComponent,
        SaisieLibreDossierComponent,
        AddRelationClientComponent
    ]
})
export class SharedModule { }
