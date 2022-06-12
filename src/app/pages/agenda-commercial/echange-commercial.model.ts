import { EchangeCommercialStatus } from 'src/app/core/enums/echange-commercial-status.enum';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { IHistorique } from 'src/app/core/models/general/historique';
import { Memo } from 'src/app/core/models/general/memo.model';
import { EchangeCommercialPriority } from '../../core/enums/echange-commercial-priority.enum';
import { EchangeCommercialType } from '../../core/enums/echange-commercial-type.enum';
import { IAgence } from '../../core/models/agence/agence.model';
import { IUser } from '../../core/models/user/userModel';
import { IClient } from '../clients/client.model';
import { IDossier } from '../dossier/dossier.model';

/**
 * a interface describe IEchangeCommercial
 */
export interface IEchangeCommercial {

    /** the id of dossier */
    id: string;

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: string;

    /** the duree of echange commercial */
    duree: string;

    /** the hour of echange commercial */
    time: string;

    /** the type of echange commercial */
    type: EchangeCommercialType;

    /** the status of echange commercial */
    status: EchangeCommercialStatus;

    /** the priority of echange commercial */
    priorite: EchangeCommercialPriority;

    /** phone number of agence */
    phoneNumber: string;

    /** the contacts of echange commercial */
    contacts: IContact[];

    /** the addresses of echange commercial */
    addresses: Address[];

    /** the memos of echange commercial */
    memos: Memo[];

    /** the historique of echange commercial */
    historique: IHistorique[];

    /** the id of tache of echange commercial */
    tacheTypeId: string;

    /** the id of tache of echange commercial */
    tacheType: IAgendaConfig;

    /** the id of rdv of echange commercial */
    rdvTypeId: string;

    /** the rdv of echange commercial */
    rdvType: IAgendaConfig;

    /** the categorie of echange commercial */
    categorieId: string;

    /** the categorie of echange commercial */
    categorie: IAgendaConfig;

    /** the id of appel of echange commercial */
    typeAppelId: string;

    /** the id of appel of echange commercial */
    typeAppel: IAgendaConfig;

    /** the id of source RDV of echange commercial */
    sourceRDVId: string;

    /** the id of source RDV of echange commercial */
    sourceRDV: IAgendaConfig;

    /** the client of this echange commercial */
    client: IClient;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the dossier of this echange commercial */
    dossier: IDossier;

    /** the id of dossier */
    dossierId: string;

    /** the id of agence */
    agenceId: string;

    /** the agence of this echange commercial */
    agence: IAgence;

    /** the id of User */
    responsable: IUser;

    /** the id of responsable */
    responsableId: string;
}

/**
 * a interface describe IEchangeCommercial model
 */
export interface IEchangeCommercialModel {

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: string;

    /** the duree of echange commercial */
    duree: string;

    /** the hour of echange commercial */
    time: string;

    /** the type of echange commercial */
    type: EchangeCommercialType;

    /** the status of echange commercial */
    status: EchangeCommercialStatus;

    /** the priority of echange commercial */
    priorite: EchangeCommercialPriority;

    /** phone number of echange commercial */
    phoneNumber: string;

    /** the contacts of echange commercial */
    contacts: IContact[];

    /** the addresses of echange commercial */
    addresses: Address[];

    /** the id of tache of echange commercial */
    tacheTypeId: string;

    /** the id of rdv of echange commercial */
    rdvTypeId: string;

    /** the categorie of echange commercial */
    categorieId: string;

    /** the id of appel of echange commercial */
    typeAppelId: string;

    /** the id of source RDV of echange commercial */
    sourceRDVId: string;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the id of dossier */
    dossierId: string;

    /** the id of agence */
    agenceId: string;

    /** the id of responsable */
    responsableId: string;
}

/**
 * a interface describe IEchangeCommercial data table
 */
export interface IEchangeCommercialList {

    /** the id of dossier */
    id: string;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the type of echange commercial */
    status: EchangeCommercialStatus;

    /** the id of responsable/user */
    responsableId: string;

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: string;

    /** the adresse of echange commercial */
    adresse: string;

    /** the contact of echange commercial */
    contact: string;

    /** phone number of echange commercial */
    phoneNumber: string;
}

/** an interface describe Type rdv */
export interface IAgendaConfig {

    /** the id of Type Tache */
    id: string;

    /** name of Type Tache */
    name: string;

}

/** an interface describe IChange Date Event Model */
export interface IChangeDateEventModel {
    id: string | number;
    dateEvent: string;
    time: string | null;
}

/** an interface describe Type and date in agenda to add it */
export interface IAgendaModel {

    /** the Type of echange commercial */
    type: EchangeCommercialType;

    /** date of agenda model */
    dateEvent: string;

}

/** an interface describe RDV if that exist */
export interface ICheckRdvIsExistModel {
    dateEvent: string;
    time: string | null;
    responsableId: string;
    clientId: string;
}
