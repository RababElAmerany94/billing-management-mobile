import { PosteType } from '../../enums/poste-type.enum';
import { FicheControleStatusItem } from '../../enums/fiche-controle-status-item.enum';

export interface IConstatCombles {
    posteType: PosteType;
    surfaceIsolantPrevue: number;
    surfaceIsolantPose: number;
    isEcartSurfacePrevueAndPoseOk: boolean;
    surfaceEstimeDepuis: string;
    surfaceIsolantRetenue: number;
    rehausseOuProtectionInstallationsElectriques: FicheControleStatusItem;
    reperageBoitesElectriques: FicheControleStatusItem;
    presenceEcartAuFeuOuConduitsEvacuationFumees: FicheControleStatusItem;
    presenceCoffrageTrappeVisite: FicheControleStatusItem;
    trappeVisiteIsolee: FicheControleStatusItem;
    presenceProtectionPointsLumineuxTypeSpots: FicheControleStatusItem;
    presencePigeReperageHauteurIsolant: FicheControleStatusItem;
    epaisseurMesuree: number;
    conclusionEpaisseur: boolean;
    homogeneiteCoucheIsolant: boolean;
}
