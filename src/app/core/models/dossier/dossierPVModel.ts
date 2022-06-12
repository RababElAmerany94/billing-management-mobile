import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { IArticle } from '../general/article.model';
import { IPhotoDocument } from '../general/photo-document';
import { IFicheControle } from './ficheControleModel';

/**
 * an interface describe dossier pv
 */
export interface IDossierPV {

    /** the id of dossier PV. */
    id: string;

    /** the photos of dossier PV. */
    photos: IPhotoDocument[];

    /** the article of dossier PV. */
    articles: IArticle[];

    /** the date of creation */
    createdOn: Date;

    /** is the client satisfied of service offered */
    isSatisfied: boolean;

    /** the reason of no satisfaction of client */
    reasonNoSatisfaction: string;

    /** the name of client who sign PV */
    nameClientSignature: string;

    /** the signature of client */
    signatureClient: string;

    /** the photos of techncien */
    signatureTechnicien: string;

    /** the fiche controle id associate with this entity */
    ficheControleId: string;

    /** the fiche controle associate with this entity */
    ficheControle: IFicheControle;

    /** the dossier id of dossier PV */
    dossierId: string;

    /** the dossier of dossier PV */
    dossier: IDossier;
}

export interface IDossierPVModel {

    /** the photos of dossier PV. */
    photos: IPhotoDocument[];

    /** the article of dossier PV. */
    articles: IArticle[];

    /** is the client satisfied of service offered */
    isSatisfied: boolean;

    /** the reason of no satisfaction of client */
    reasonNoSatisfaction: string;

    /** the name of client who sign PV */
    nameClientSignature: string;

    /** the signature of client */
    signatureClient: string;

    /** the photos of techncien */
    signatureTechnicien: string;

    /** the fiche controle id associate with this entity */
    ficheControleId: string;

    /** the fiche controle associate with this entity */
    ficheControle: IFicheControle;

    /** the dossier id of dossier PV */
    dossierId: string;

    /** the dossier of dossier PV */
    dossier: IDossier;
}
