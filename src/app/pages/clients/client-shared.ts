import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings/app-settings';

export class ClientShared {

    static createForm(formBuilder: FormBuilder): FormGroup {
        return formBuilder.group({
            reference: [null, [Validators.required]],
            firstName: [null, [Validators.required]],
            lastName: [null],
            regulationModeId: [null],
            phoneNumber: [null, [Validators.required]],
            sourceLead: [null],
            email: [null, [Validators.required, Validators.pattern(AppSettings.regexEmail)]],
            webSite: [null],
            siret: [null],
            codeComptable: [null, [Validators.required]],
            commercialId: [null],
            type: [null, [Validators.required]],
            primeCEEId: [null],
            labelPrimeCEE: [null],
            typeTravaux: [null],
            genre: [null, [Validators.required]],
            numeroDHA: [null],
            revenueFiscaleReference: [null],
            precarite: [null],
            isMaisonDePlusDeDeuxAns: [null],
            nombrePersonne: [null],
            surfaceTraiter: [null],
            parcelleCadastrale: [null],
            logementTypeId: [null],
            typeChauffageId: [null],
            isSousTraitant: [false],
            dateReceptionLead: [null],
            agenceId: [null],
            noteDevis: [null],
        });
    }

}
