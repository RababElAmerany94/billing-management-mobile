import { FileManagerModel } from '../models/general/file-manager.model';
import { IPhotoDocument } from '../models/general/photo-document';
import { StringHelper } from './string';

export class PhotoDocumentHelper {

    /**
     * get list of files base64
     * @param photos the photos array
     */
    static getFilesFromPhotos(photos: IPhotoDocument[]): FileManagerModel[] {
        const files: FileManagerModel[] = [];

        for (const photo of photos) {
            if (!StringHelper.isEmptyOrNull(photo.image.file)) {
                const file = {
                    base64: photo.image.file,
                    name: photo.image.name
                };
                files.push(file);
            }
        }

        return files;
    }

    /**
     * delete base64 from photos
     * @param photos the photos that we want to clean
     */
    static cleanBase64(photos: IPhotoDocument[]): IPhotoDocument[] {
        for (const photo of photos) {
            photo.image.file = null;
        }
        return photos;
    }

}
