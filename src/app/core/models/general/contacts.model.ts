export interface IContact {
    civilite: string;
    email: string;
    nom: string;
    mobile: string;
    prenom: string;
    fixe: string;
    fonction: string;
    commentaire: string;
    isDefault: boolean;
}
export interface IContactModel extends IContact {
    isNew: boolean;
}
