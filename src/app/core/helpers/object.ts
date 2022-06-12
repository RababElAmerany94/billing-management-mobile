export class ObjectHelper {

    /**
     * check object is null or undefined
     * @param obj the given object
     */
    static isNullOrUndefined(obj: any) {
        return obj === '' || obj == null || obj === undefined;
    }

}
