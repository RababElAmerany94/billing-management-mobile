import { StringHelper } from './string';

/**
 * a class contains JSON helpers
 */
export class JsonHelper {

    /**
     * de-serialize json string
     */
    static deSerializeJson(json: string) {
        if (StringHelper.isEmptyOrNull(json) || !JsonHelper.isJsonString(json)) { return null; }
        return JSON.parse(json);
    }

    /**
     * check json string is valid
     * @param json the json to check
     */
    static isJsonString(json: string) {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }
        return !StringHelper.isEmptyOrNull(json);
    }

}
