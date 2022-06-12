import { Base64 } from '@ionic-native/base64/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File, IFile } from '@ionic-native/file/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { Platform } from '@ionic/angular';
import { InjectorInstance } from 'src/app/app.module';
import { ResultStatus } from '../enums/result-status';
import { FileManagerModel } from '../models/general/file-manager.model';
import { Memo } from '../models/general/memo.model';
import { IPhotoDocument } from '../models/general/photo-document';
import { PieceJoin } from '../models/general/pieceJoin.model';
import { FileManagerService } from '../services/file-manager/file-manager.service';
import { DateHelper } from './date';
import { MemoHelper } from './memo';
import { PhotoDocumentHelper } from './photo-document';
import { StringHelper } from './string';

export class FileHelper {

    public static platform?: Platform = InjectorInstance.get<Platform>(Platform);
    private static printer = new Printer();
    public static fileChooser?: FileChooser = InjectorInstance.get<FileChooser>(FileChooser);
    public static fileOpener?: FileOpener = InjectorInstance.get<FileOpener>(FileOpener);
    public static filePath?: FilePath = InjectorInstance.get<FilePath>(FilePath);
    public static filePicker?: IOSFilePicker = InjectorInstance.get<IOSFilePicker>(IOSFilePicker);
    public static base64?: Base64 = InjectorInstance.get<Base64>(Base64);
    private static file = new File();

    /**
     * upload memos
     * @param fileManagerService the file manger service
     * @param memo the memo that we want to add
     * @param callback the success callback
     * @param callbackError the error callback
     */
    static uploadMemo(fileManagerService: FileManagerService, memo: Memo, callback: (arg0: Memo) => void, callbackError: () => void) {
        const files: FileManagerModel[] = MemoHelper.getFilesFromMemo(memo);
        memo = MemoHelper.cleanBase64(memo);
        fileManagerService.Add(files).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                callback(memo);
            } else {
                callbackError();
            }
        });
    }

    /**
     * upload photos
     * @param fileManagerService the file manger service
     * @param photos the photos that we want to add
     * @param callback the success callback
     * @param callbackError the error callback
     */
    static uploadPhotos(
        fileManagerService: FileManagerService,
        photos: IPhotoDocument[],
        callbackSucceeded: (arg0: IPhotoDocument[]) => void,
        callbackError: () => void) {
        const files: FileManagerModel[] = PhotoDocumentHelper.getFilesFromPhotos(photos);
        photos = PhotoDocumentHelper.cleanBase64(photos);
        if (files.length > 0) {
            fileManagerService.Add(files).subscribe(res => {
                if (res.status === ResultStatus.Succeed) {
                    callbackSucceeded(photos);
                } else {
                    callbackError();
                }
            });
        } else {
            callbackSucceeded(photos);
        }
    }

    /**
     * download piece joint
     */
    static downloadPieceJoin(
        fileManagerService: FileManagerService,
        pieceJoint: PieceJoin,
        showLoader: () => void,
        hideLoader: () => void,
        errorHandle: (error: any) => void) {
        showLoader();
        fileManagerService.Get(pieceJoint.name).subscribe(result => {
            hideLoader();
            if (result.status === ResultStatus.Succeed) {
                FileHelper.downloadBase64(
                    result.value,
                    pieceJoint.orignalName,
                    pieceJoint.file.substring('data:'.length, pieceJoint.file.indexOf(';base64')));
            }
        }, err => {
            hideLoader();
            errorHandle(err);
        });
    }

    /**
     * display piece joint
     */
    static displayPieceJoin(
        fileManagerService: FileManagerService,
        pieceJoint: PieceJoin,
        showLoader: () => void,
        hideLoader: () => void,
        errorHandle: (error: any) => void) {
        showLoader();
        fileManagerService.Get(pieceJoint.name).subscribe(result => {
            hideLoader();
            if (result.status === ResultStatus.Succeed) {
                FileHelper.downloadBase64(
                    result.value,
                    pieceJoint.orignalName,
                    pieceJoint.file.substring('data:'.length, pieceJoint.file.indexOf(';base64')),
                    true);
            }
        }, err => {
            hideLoader();
            errorHandle(err);
        });
    }

    /**
     * get list file from piece jointes
     * @param pieceJointes the list piece joint
     */
    static getFilesFromPieceJoin(pieceJointes: PieceJoin[]): FileManagerModel[] {
        const files: FileManagerModel[] = [];
        for (const pieceJointe of pieceJointes) {
            if (!StringHelper.isEmptyOrNull(pieceJointe.file)) {
                const file = {
                    base64: pieceJointe.file,
                    name: pieceJointe.name
                };
                files.push(file);
            }
        }
        return files;
    }

    /**
     * upload file
     */
    static uploadFiles(fileManagerService: FileManagerService, files: FileManagerModel[], callback, callbackError) {
        if (files.length > 0) {
            fileManagerService.Add(files).subscribe(res => {
                if (res.status === ResultStatus.Succeed) {
                    callback();
                } else {
                    callbackError();
                }
            });
        } else {
            callback();
        }
    }

    /**
     * print pdf
     */
    static printPdf(base64: string, name: string) {
        const stamp = new Date().getTime();
        const data = ',' + base64;
        const fileName = name + '_' + stamp + '.pdf';
        const fileType = 'application/pdf';
        const filePath = (fileName || DateHelper.getNowDateForIdentityValue());
        const blob = this.b64toBlob((data.split(',')[1]), fileType);
        this.file.writeFile(this.file.dataDirectory, `${filePath}`,
            blob, { replace: true }).then(_ => {
                this.printer.print(this.file.dataDirectory + `${filePath}`).then((onSuccess) => {
                    console.log('success', onSuccess);
                }, (onError) => {
                    console.log('error', onError);

                });
            });
    }


    /**
     * Base64 to blob
     */
    static b64toBlob(base64Data: string, contentType: string = '', sliceSize = 512) {
        try {
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
        } catch (e) {
            console.log('TO BLOB: ' + e.toString());
        }
    }

    /**
     * download file from base64
     */
    static downloadBase64(data: string, fileName: string, contentType: string, putInCache = false) {
        try {
            const base64toBlob = this.b64toBlob((data.split(',')[1]), contentType);
            let directory = '';
            if (putInCache) {
                directory = this.platform.is('ios') ? this.file.tempDirectory : this.file.externalCacheDirectory;
            } else {
                directory = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalApplicationStorageDirectory;
            }
            this.file.writeFile(directory, fileName, base64toBlob, { replace: true }).then(fileEntry => {
                this.fileOpener.open(fileEntry['nativeURL'.toString()], contentType).then(_ => { });
            }, err => {
                console.log(err);
            });
        } catch (e) {
            alert(e);
        }
    }

    /**
     * download pdf
     */
    static downloadPDF(base64: string, name: string) {
        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        // file type
        const fileType = 'application/pdf';

        // file extension
        const extension = 'pdf';

        FileHelper.downloadBase64(',' + base64, `${name}_${stamp}.${extension}`, fileType);
    }

    /**
     * take picture
     */
    public static async takePicture(camera: Camera) {
        const options: CameraOptions = {
            quality: 100,
            targetHeight: 500,
            targetWidth: 500,
            destinationType: camera.DestinationType.DATA_URL,
            encodingType: camera.EncodingType.JPEG,
            mediaType: camera.MediaType.PICTURE
        };
        const base64 = await camera.getPicture(options);
        return `data:image/jpeg;base64,${base64}`;
    }

    /**
     * visualize pdf
     */
    static visualiserPdf(base64: string) {
        const data = ',' + base64;
        const fileType = 'application/pdf';
        const blob = this.b64toBlob((data.split(',')[1]), fileType);
        return window.URL.createObjectURL(blob);

    }

    /**
     * choose file
     */
    static async chooseFile() {
        return new Promise(async (resolve, reject) => {
            try {
                let uri = '';
                let filePath = '';

                if (this.platform.is('android')) {
                    uri = await this.fileChooser.open();
                    filePath = await this.filePath.resolveNativePath(uri);
                } else {
                    uri = await this.filePicker.pickFile();
                    filePath = (window as any).Ionic.WebView.convertFileSrc(uri);
                }
                console.log(filePath);

                // encode the File
                const base64File: string = await this.base64.encodeFile(filePath);

                const pieceJoin: PieceJoin = {
                    name: StringHelper.guid(),
                    size: (await this.getFileInfo(uri)).valueOf() as number,
                    type: filePath.substring(filePath.lastIndexOf('.') + 1),
                    orignalName: filePath.split('/').reverse()[0],
                    file: base64File.toString()
                };
                if (pieceJoin) {
                    resolve(pieceJoin);
                } else {
                    reject();
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public static getFileInfo(fileURI) {
        return new Promise((resolve, reject) => {
            let fileSize: number;
            const path = this.platform.is('android') ? fileURI : 'file://' + fileURI;
            return this.file
                .resolveLocalFilesystemUrl(path)
                .then((fileEntry: any) => {
                    new Promise((rslv, rjct) => {
                        fileEntry.file(meta => rslv(meta), (error: any) => rjct(error));
                    }).then((meta: IFile) => {
                        fileSize = meta.size;
                        resolve(fileSize);
                    }).catch((err) => { console.log({ err }); reject(); });
                }).catch((err) => { console.log({ err }); reject(); });
        });
    }
}
