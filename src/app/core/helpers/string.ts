import { uuid } from 'uuidv4';

/**
 * an interface describe string helpers
 */
export class StringHelper {

    /**
     * check string is empty or null
     * @param value the value that we want to check
     */
    static isEmptyOrNull(value: string): boolean {
        return value === null || value === '' || value === undefined;
    }

    /**
     * Guid
     */
    static guid() {
        return uuid();
    }

    /** generate color  */

    static getColor(str: string = '') {
        let hash = 0;
        let color = '#';
        for (let i = 0; i < str.length; i++) {
            // tslint:disable-next-line:no-bitwise
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        for (let i = 0; i < 3; i++) {
            // tslint:disable-next-line:no-bitwise
            const value = (hash >> (i * 8)) & 0xff;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    /**
     * safe navigate
     * @param val the value we want to check
     */
    static safeNavigate(val: string) {
        return StringHelper.isEmptyOrNull(val) ? '' : val;
    }

    /** check if data is array type or not */
    static hasData(data: any) {
        if (Array.isArray(data)) {
            return data.length > 0;
        } else {
            return data != null;
        }
    }

    static concatFirstNameLastName(entity: any) {
        return (entity != null ? `${entity.firstName} ${entity.lastName != null ? entity.lastName : ''}` : '');
    }
}
