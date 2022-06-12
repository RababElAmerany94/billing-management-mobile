import { IUser } from 'src/app/core/models/user/userModel';
import { IAgence } from 'src/app/core/models/agence/agence.model';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { PrecariteType } from 'src/app/core/enums/precarite.enums';
import { TypeTravaux } from 'src/app/core/enums/type-travaux.enum';
import { IDossier } from '../dossier/dossier.model';
import { IRegulationMode } from 'src/app/core/models/general/regulation-mode.model';
import { GenreClient } from '../../core/enums/genre-client.enum';
import { ITypeLogement } from '../../core/models/type-logement/fournisseurs.model';
import { ITypeChauffage } from 'src/app/core/models/type-chauffage/type-chauffage.model';
import { IClientRelation, IClientRelationModel } from 'src/app/core/models/general/client-relation.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { Address } from 'src/app/core/models/general/address.model';
import { IHistorique } from 'src/app/core/models/general/historique';
import { Memo } from 'src/app/core/models/general/memo.model';

/**
 * an interface describe IClient
 */
export interface IClient {

    /** the id of client */
    id: string;

    /** the reference of client */
    reference: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the fullName of client */
    fullName: string;

    /** the type of client */
    type: ClientType;

    /** the genre of client */
    genre: GenreClient;

    /** the id of modeRegelement of client */
    regulationModeId: string;

    /** the modeRegelement of client */
    regulationMode: IRegulationMode;

    /** the phoneNumber of client */
    phoneNumber: string;

    /** the email of client */
    email: string;

    /** the webSite of client */
    webSite: string;

    /** the Siret of client */
    siret: string;

    /** the codeComptable of client */
    codeComptable: string;

    /** the address of client */
    addresses: Address[];

    /** the contacts of client */
    contacts: IContact[];

    /** the dateReceptionLead of client */
    dateReceptionLead: Date;

    /** the sourceLead of client */
    sourceLead: string;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the type logement of dossier */
    logementType: ITypeLogement;

    /** the parcelleCadastrale of client */
    parcelleCadastrale: string;

    /** the surfaceTraiter of client */
    surfaceTraiter?: number;

    /** the nombre Personne of client */
    nombrePersonne: number;

    /** the Is Maison De Plus De Deux Ans of client */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of client */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of client */
    revenueFiscaleReference: string;

    /** the numeroDHA of client */
    numeroDHA: number;

    /** the typeTravaux of client */
    typeTravaux: TypeTravaux;

    /** the id of commercial of client */
    commercialId: string;

    /** the commercial of client */
    commercial: IUser;

    /** the type Chauffage of dossier */
    typeChauffage: ITypeChauffage;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the historique of client */
    historique: IHistorique[];

    /** the memo of client */
    memos: Memo[];

    /** the agenceId of client */
    agenceId: string;

    /** the agenceId of client */
    agence: IAgence;

    /** the primeCEE of client */
    primeCEE: IClientListModel;

    /** the id primeCEE of client */
    primeCEEId: string;

    /** the client is sous traitant */
    isSousTraitant: boolean;

    /** the relationship of client */
    relations: IClientRelation[];

    /** the note of devis of client */
    noteDevis: string;

    /** the labelPrimeCEE of client */
    labelPrimeCEE: string;

    /** the list of client */
    clients: IClient[];

    /** the dossier of client */
    Dossiers: IDossier[];
}

/**
 * an interface describe IClientModel
 */
export interface IClientModel {

    /** the reference of client */
    reference: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the fullName of client */
    fullName: string;

    /** the Siret of client */
    siret: string;

    /** the type of client */
    type: ClientType;

    /** the genre of client */
    genre: GenreClient;

    /** the id of modeRegelement of client */
    regulationModeId: string;

    /** the phoneNumber of client */
    phoneNumber: string;

    /** the email of client */
    email: string;

    /** the webSite of client */
    webSite: string;

    /** the codeComptable of client */
    codeComptable: string;

    /** the address of client */
    addresses: Address[];

    /** the contacts of client */
    contacts: IContact[];

    /** the dateReceptionLead of client */
    dateReceptionLead: Date;

    /** the sourceLead of client */
    sourceLead: string;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the parcelleCadastrale of client */
    parcelleCadastrale: string;

    /** the surfaceTraiter of client */
    surfaceTraiter?: number;

    /** the nbPersonne of client */
    nombrePersonne: number;

    /** the isMaisonDePlusDe2Ans of client */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of client */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of client */
    revenueFiscaleReference: string;

    /** the numeroDHA of client */
    numeroDHA: number;

    /** the typeTravaux of client */
    typeTravaux: TypeTravaux;

    /** the id of commercial of client */
    commercialId: string;

    /** the id primeCEE of client */
    primeCEEId: string;

    /** the client is sous traitant */
    isSousTraitant: boolean;

    /** the labelPrimeCEE of client */
    labelPrimeCEE: string;

    /** the relationship of client */
    relations: IClientRelationModel[];

    /** the historique of client */
    historique: string;

    /** the note of devis of client */
    noteDevis: string;

    /** the agenceId of client */
    agenceId: string;
}

/**
 * list of client model
 */
export interface IClientListModel {

    /** the id of client */
    id: string;

    /** the reference of client */
    reference: string;

    /** the first name of client */
    firstName: string;

    /** the last name of client */
    lastName: string;

    /** the full name of client */
    fullName: string;

    /** the type of client */
    type: ClientType;

    /** the id of agence associate with client */
    agenceId: string;

    /** the agence associate with client */
    agence: string;
}


/**
 * an interface describe IClientDataTables
 */
export interface IClientDataTables {

    /** the id of client */
    id: string;

    /** the reference of client */
    reference: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the agence of client */
    agenceId: string;
}
