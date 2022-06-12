import { StringHelper } from './string';

/**
 * a class describe date helpers
 */
export class DateHelper {

    static initTime = '00:00:00';

    /**
     * FORMAT DATE TIME
     */
    static formatDateTime(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minutes}`;
    }

    /**
     * FORMAT DATE
     * @param date Date
     */
    static formatDate(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}T00:00`;
    }

    /**
     * FORMAT Day and Month
     * @param date Date
     */
    static formatDayMonth(date: string) {
        const convertDate = new Date(date);
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    }

    /**
     * compare date
     */
    static compareDateToday(date: string) {
        const convertDate = new Date(date).getDate();
        const today = new Date().getDate();
        return convertDate === today;
    }

    /**
     * compare date
     */
    static compareDateTomorrow(date: string) {
        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1)).getDate();
        const convertDate = new Date(date).getDate();
        return convertDate === tomorrow;
    }

    /**
     * compare date
     */
    static compareDateToComeUp(date: string) {
        const convertDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1));
        return convertDate > tomorrow;
    }

    /**
     * the date of yesterday
     */
    static yesterdayDate() {
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 1);
        return todayDate;
    }

    public static getNowDateForIdentityValue() {
        const dateNow = new Date();
        return `${dateNow.getFullYear()}`
            + `${(dateNow.getMonth() + 1).toString().padStart(2, '0')}`
            + `${(dateNow.getDay() + 1).toString().padStart(2, '0')}`
            + `${(dateNow.getHours()).toString().padStart(2, '0')}`
            + `${dateNow.getMinutes().toString().padStart(2, '0')}`
            + `${dateNow.getSeconds().toString().padStart(2, '0')}`
            + `${dateNow.getMilliseconds().toString().padStart(4, '0')}`;
    }

    /**
     * FORMAT TIME
     */
    static formatTime(date: string) {
        const convertDate = new Date(date);
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${hour}:${minutes}`;
    }

    /**
     * is valid date
     */
    static isValidDate(date: string) {
        const unixTimeZero = Date.parse(date);
        return !isNaN(unixTimeZero);
    }

    /**
     * combine between date and time
     * @param date the date
     * @param time the time
     */
    static combineDateWithTime(date: string, time: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().length === 1 ?
            '0' + (convertDate.getMonth() + 1)
            : (convertDate.getMonth() + 1);
        const day = convertDate.getDate().toString().length === 1 ? '0' + convertDate.getDate() : convertDate.getDate();
        if (!StringHelper.isEmptyOrNull(time) && !time.includes(this.initTime)) {
            return `${year}-${month}-${day}T${this.formatTime(time)}`;
        } else {
            return `${year}-${month}-${day}`;
        }
    }

    /**
     * add time to date
     * @param date the date
     * @param time the time you want to add
     */
    static addTimeToDate(date: string, time: string) {
        const convertDate = new Date(date);
        if (!StringHelper.isEmptyOrNull(time) && !time.includes(this.initTime)) {
            const convertTime = new Date(`2019-01-01T${time}`);
            convertDate.setHours(convertDate.getHours() + convertTime.getHours());
            convertDate.setMinutes(convertDate.getMinutes() + convertTime.getMinutes());
            return this.formatDateTime(convertDate.toString());
        } else {
            return date;
        }
    }

    /** get last day in the current year */
    static getLastDayInTheCurrentYear() {
        const date = new Date();
        return `${date.getFullYear()}-12-31T00:00`;
    }

    static getFirstDayInTheCurrentYear() {
        const date = new Date();
        return `${date.getFullYear()}-01-01T00:00`;
    }

    /**
     * the date format
     */
    static getDates(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${year}/${month}/${day} - ${hour}:${minutes}`;
    }
}
