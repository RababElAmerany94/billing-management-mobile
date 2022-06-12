import { JsonHelper } from './json';
import { StringHelper } from './string';
import { Address } from '../models/general/address.model';
import { IContact } from '../models/general/contacts.model';

export class AddressAndContactHelper {

    static getAddress(addresses: string) {
        const address = (JsonHelper.isJsonString(addresses)
            && !StringHelper.isEmptyOrNull(addresses)) ? JSON.parse(addresses) as Address : null;
        return address;
    }

    static getContact(contact: string) {
        const contacts = (JsonHelper.isJsonString(contact)
            && !StringHelper.isEmptyOrNull(contact)) ? JSON.parse(contact) as IContact : null;
        return contacts;
    }

    /**
     * build phrase base to contact object
     */
    static buildPhraseContact(contact: IContact) {
        if (contact == null) { return ''; }
        return `${contact.civilite} ${contact.nom} ${contact.prenom}`;
    }
}
