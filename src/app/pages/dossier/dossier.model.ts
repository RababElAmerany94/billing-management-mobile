import { IClient, IClientListModel } from '../clients/client.model';
import { TypeTravaux } from 'src/app/core/enums/type-travaux.enum';
import { PrecariteType } from 'src/app/core/enums/precarite.enums';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { DocType } from 'src/app/core/enums/doctype.enums';
import { IUserLiteModel } from 'src/app/core/models/user/userModel';
import { IDevis } from '../devis/devis.model';
import { IDossierPV } from 'src/app/core/models/dossier/dossierPVModel';
import { ITypeLogement } from '../../core/models/type-logement/fournisseurs.model';
import { ITypeChauffage } from 'src/app/core/models/type-chauffage/type-chauffage.model';
import { VisteTechniqueType } from 'src/app/core/enums/viste-technique-type.enum';
import { ClassementTechnique } from 'src/app/core/enums/classement-technique.enum';
import { VisteTechniqueTypeAccess } from 'src/app/core/enums/viste-technique-type-access.enum';
import { VisteTechniqueToit } from 'src/app/core/enums/viste-technique-toit.enum';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { IHistorique } from 'src/app/core/models/general/historique';
import { Memo } from 'src/app/core/models/general/memo.model';
import { IDossierInstallation } from './components/dossier-installation/dossier-installation.model';

/**
 * a interface describe IDossier
 */
export interface IDossier {

    /** the id of dossier */
    id: string;

    /**  the reference of dossier */
    reference: string;

    /**  the date of created of dossier */
    createdOn: Date;

    /** the commercial associate with dossier */
    commercialId?: string;

    /**  the commercial of dossier */
    commercial: IUserLiteModel;

    /** the date Pose of dossier */
    datePose: Date;

    /** the date creation of dossier */
    dateCreation: Date;

    /** the date expiration of dossier */
    dateExpiration: Date;

    /** the date RDV of dossier */
    dateRDV?: Date;

    /** the contacts of dossier */
    contact: IContact;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** the history of dossier */
    historique: IHistorique[];

    /** the memo of dossier */
    memos: Memo[];

    /** the note of dossier */
    note: string;

    /** the sourceLead of dossier */
    sourceLead: string;

    /** the dateReceptionLead of dossier */
    dateReceptionLead: Date;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the type logement of dossier */
    logementType: ITypeLogement;

    /** the type Chauffage of dossier */
    typeChauffage: ITypeChauffage;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the first phoneNumber of dossier */
    firstPhoneNumber: string;

    /** the second phoneNumber of dossier */
    secondPhoneNumber: string;

    /** the parcelleCadastrale of dossier */
    parcelleCadastrale: string;

    /** the surfaceTraiter of dossier */
    surfaceTraiter?: number;

    /** the nombrePersonne of dossier */
    nombrePersonne: number;

    /** the isMaisonDePlusDeDeuxAns of dossier */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of dossier */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of dossier */
    revenueFiscaleReference: string;

    /** the numeroDHA of dossier */
    numeroDHA: string;

    /** the typeTravaux of dossier */
    typeTravaux: TypeTravaux;

    /** the of Status dossier */
    status: DossierStatus;

    /** the primeCEE of dossier */
    primeCEE: IClientListModel;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the client of dossier */
    client: IClient;

    /** the cliennt id associate with this dossier */
    clientId: string;

    /** the list of dateInstallation in dossier */
    // dossierInstallations: IDossierInstallation[];

    /** the visite technique of diossier */
    visteTechnique: IVisteTechnique;

    /** the list of dateInstallation in dossier */
    devis: IDevis;

    /** the documentAssociate of the dossier */
    documentAssociates: IDocumentAssociateModel[];

    /** the pv of dossier */
    pVs: IDossierPV[];

    /** the list of dateInstallation in dossier */
    dossierInstallations: IDossierInstallation[];

    /** the additional information of site installation */
    siteInstallationInformationsSupplementaire: { [key: string]: string; };

}

/**
 * an interface describe DossierModel model
 */
export interface IDossierModel {

    /**  the reference of dossier */
    reference: string;

    /**  the date of created of dossier */
    createdOn: Date;

    /** the date Pose of dossier */
    datePose: Date;

    /** the contacts of dossier */
    contact: IContact;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** the memo of dossier */
    memos: Memo[];

    /** the note of dossier */
    note: string;

    /** the sourceLead of dossier */
    sourceLead: string;

    /** the dateReceptionLead of dossier */
    dateReceptionLead: Date;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the type logement of dossier */
    logementType: ITypeLogement;

    /** the parcelleCadastrale of dossier */
    parcelleCadastrale: string;

    /** the surfaceTraiter of dossier */
    surfaceTraiter?: number;

    /** the nombrePersonne of dossier */
    nombrePersonne: number;

    /** the isMaisonDePlusDeDeuxAns of dossier */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of dossier */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of dossier */
    revenueFiscaleReference: string;

    /** the numeroDHA of dossier */
    numeroDHA: string;

    /** the typeTravaux of dossier */
    typeTravaux: TypeTravaux;

    /** the primeCEE of dossier */
    primeCEE: IClientListModel;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the cliennt id associate with this dossier */
    clientId: string;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the of Status dossier */
    status: DossierStatus;

    /** the commercial associate with dossier */
    commercialId?: string;

    /** the date of rdv of dossier */
    dateRDV?: Date;

    /** the id of premier RDV */
    premierRdvId?: string;

    /** the pv of dossier */
    pVs: IDossierPV[];

    /** the additional information of site installation */
    siteInstallationInformationsSupplementaire: { [key: string]: string; };

}

/**
 * an interface describe dossier list
 */
export interface IDossierDataList {

    /** the id of dossier */
    id: string;

    /** the client associate with this dossier */
    client: string;

    /** the client id associate with this dossier */
    clientId: string;

    /**  the reference of dossier */
    reference: string;

    /** the date Rdv of dossier */
    dateRDV: Date;

    /** the date creation of dossier */
    dateCreation: Date;

    /** the typeTravaux of dossier */
    typeTravaux: TypeTravaux;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the commercial associate with dossier */
    commercialId: string;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** the adresse of dossier */
    addresse: string;

    /** the of Status dossier */
    status: DossierStatus;

}

/**
 * an interface describe document associee
 */
export interface IDocumentAssociateModel {

    /** the id dossier */
    id: string;

    /** the type dossier */
    type: DocType;

    /** the createOn dossier */
    createOn: string;

    /** the of reference dossier */
    reference: string;

    /** the TotalTTC of dossier */
    totalTTC: string;

    /** the of reference dossier */
    status: number;
}

/**
 * an interface describe dossier assignation
 */
export interface DossierAssignationModel {
    dossierId: string;
    commercialId: string;
    dateRDV: Date;
    status: DossierStatus;
}

export interface IVisteTechnique {
    type: VisteTechniqueType;
    nombrePiece: number;
    surfaceTotaleAIsoler: number;
    classementTechnique: ClassementTechnique;
    formulaires: IVisteTechniqueFormulaire[];
}

export interface IVisteTechniqueFormulaire {
    typeAccess: VisteTechniqueTypeAccess | null;
    dimensions: string;
    toit: VisteTechniqueToit | null;
    detailTypeAccess: string;
    surfaceComble: number | null;
    surfacePiece: number | null;
    typePlancher: string;
    hauteurSousFaitage: number | null;
    hauteurSousPlafond: number | null;
    nombreConduitCheminee: number | null;
    nombreSpotsAProteger: number | null;
    nombreLuminaire: number | null;
    nombreVMC: number | null;
    presenceTuyauterie: string;
    typeSupport: string;
    presencePorteGarge: number | null;
    isDegagementAPrevoir: boolean;
    isACoffrer: boolean;
    isARehausser: boolean;
    isPresenceNuisibles: boolean;
    typeNuisible: string;
    isPresenceBoitesDerivation: boolean;
}
