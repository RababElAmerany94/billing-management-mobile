/**
 * an interface describe Fiche Controle
 */
import { IUser } from '../user/userModel';
import { IDossierPV } from './dossierPVModel';
import { PrestationType } from '../../enums/prestation-type.enum';
import { IConstatMurs } from '../general/constat-murs.model';
import { IConstatPlanchers } from '../general/constat-planchers.model';
import { IConstatCombles } from '../general/constat-combles.model';
import { IPhotoDocument } from '../general/photo-document';

export interface IFicheControle {

    /** the id of fiche controle. */
    id: string;

    /** the number of operation */
    numberOperation: string;

    /** the date of controle */
    dateControle: string;

    /** the type of prestation */
    prestationType: PrestationType;

    /** list of photo */
    photos: IPhotoDocument[];

    /** the constat combles */
    constatCombles: IConstatCombles;

    /** the constat planchers */
    constatPlanchers: IConstatPlanchers;

    /** the constat murs */
    constatMurs: IConstatMurs;

    /** the remarques of fiche controle */
    remarques: string;

    /** the evaluation of accomagnement by 10 */
    evaluationAccompagnement: number;

    /** les travaux réalisés by 10 */
    evaluationTravauxRealises: number;

    /** La propreté du chantier by 10 */
    evaluationPropreteChantier: number;

    /** A quel niveau évalueriez-vous le contact avec nos techniciens applicateurs ? by 10 */
    evaluationContactAvecTechniciensApplicateurs: number;

    /**  the signature of controller */
    signatureController: string;

    /** the signature of client */
    signatureClient: string;

    /** the name of client signer */
    nameClientSignature: string;

    /** the controller id associate with fiche controle */
    controllerId: string;

    /** the controller associate with fiche controle */
    controller: IUser;

    /** the dossier PV with thid fiche controle */
    dossierPV: IDossierPV;
}

export interface IFicheControleModel {

    /** the number of operation */
    numberOperation: string;

    /** the date of controle */
    dateControle: string;

    /** the type of prestation */
    prestationType: PrestationType;

    /** list of photo */
    photos: IPhotoDocument[];

    /** the constat combles */
    constatCombles: IConstatCombles;

    /** the constat planchers */
    constatPlanchers: IConstatPlanchers;

    /** the constat murs */
    constatMurs: IConstatMurs;

    /** the remarques of fiche controle */
    remarques: string;

    /** the evaluation of accomagnement by 10 */
    evaluationAccompagnement: number;

    /** les travaux réalisés by 10 */
    evaluationTravauxRealises: number;

    /** La propreté du chantier by 10 */
    evaluationPropreteChantier: number;

    /** A quel niveau évalueriez-vous le contact avec nos techniciens applicateurs ? by 10 */
    evaluationContactAvecTechniciensApplicateurs: number;

    /**  the signature of controller */
    signatureController: string;

    /** the signature of client */
    signatureClient: string;

    /** the name of client signer */
    nameClientSignature: string;

    /** the controller id associate with fiche controle */
    controllerId: string;

    /** the controller associate with fiche controle */
    controller: IUser;

    /** the dossier PV with thid fiche controle */
    dossierPVId: string;
}
