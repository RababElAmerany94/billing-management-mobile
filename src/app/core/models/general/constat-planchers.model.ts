import { FicheControleStatusItem } from '../../enums/fiche-controle-status-item.enum';

export interface IConstatPlanchers {
    surfaceIsolantPrevue: number;
    surfaceIsolantPose: number;
    isPoseCorrecteIsolant: boolean;
    ecartAutourPointsEclairage: FicheControleStatusItem;
    ecartAutourBoitiersElectrique: FicheControleStatusItem;
    ecartAuFeuAutourFumees: FicheControleStatusItem;
    presenceFilsNonGainesNoyesDansIsolant: FicheControleStatusItem;
    conclusionIsolationPlanchers: boolean;
}
