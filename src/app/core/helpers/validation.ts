import { AppSettings } from 'src/app/app-settings/app-settings';

export class ValidationUtils {

    /**
     * this function check validation format
     */
    static validationDocument(file) {
        const extension = file.name.split('.').pop().toString().toLowerCase();
        if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
            return true;
        }
        return false;
    }
    /** validation picture */
    static validationPicture(file) {
        const extension = file.name.split('.').pop().toString().toLowerCase();
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
            return true;
        }
        return false;
    }

    /**
     * This function check size of file
     */
    static validationSize(file) {
        if (file.size > AppSettings.MAX_SIZE_FILE) {
            return false;
        }
        return true;
    }
}
