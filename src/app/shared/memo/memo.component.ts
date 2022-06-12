import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { AddMemoModalOutput, Memo } from 'src/app/core/models/general/memo.model';
import { PieceJoin } from 'src/app/core/models/general/pieceJoin.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ResultStatus } from '../../core/enums/result-status';
import { CopyHelper } from '../../core/helpers/copy';
import { FileHelper } from '../../core/helpers/file';
import { MemoHelper } from '../../core/helpers/memo';
import { FileManagerService } from '../../core/services/file-manager/file-manager.service';
import { ToastService, ToastTypes } from '../../core/services/toast.service';
import { AddMemoComponent } from './add-memo/add-memo.component';

@Component({
    selector: 'app-memo',
    templateUrl: './memo.component.html',
    styleUrls: ['../historique/historique.component.scss', '../../../assets/components/lists.scss'],
})
export class MemoComponent {

    @Output()
    saveMemoEvent = new EventEmitter<Memo[]>();

    @Output()
    cancelEvent = new EventEmitter();

    @Input()
    set Memos(val: Memo[]) {
        if (val) {
            this.memos = val;
        }
    }

    @Input()
    isDossier = false;

    /** list memos */
    memos: Memo[] = [];

    constructor(
        private modalController: ModalController,
        private toastService: ToastService,
        private translate: TranslateService,
        private fileManagerService: FileManagerService,
        private alertController: AlertController,
        private loadingService: LoadingService
    ) { }

    //#region memos

    /**
     * open add memo dialog
     */
    addMemo(): void {
        const data = { title: this.isDossier ? 'MEMOS_DOSSIER.ADD' : 'MEMOS.ADD', isDossier: this.isDossier };
        DialogHelper.openDialog(this.modalController, AddMemoComponent, data).then(async (result) => {
            if (!StringHelper.isEmptyOrNull(result) && result as AddMemoModalOutput) {
                await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
                FileHelper.uploadMemo(this.fileManagerService, result.memo, async (memo: Memo) => {
                    this.memos = MemoHelper.addMemoToMemos(this.memos, memo);
                    await this.loadingService.hide();
                    this.emitSaveMemo();
                }, async () => {
                    await this.loadingService.hide();
                    this.errorUpload();
                });
            }
        });
    }

    /**
     * remove memo
     */
    removeMemo(index: number) {
        const memo = this.memos[index];
        const filesNames = memo.pieceJointes.map(e => e.name);
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant(`${this.isDossier ? 'MEMOS_DOSSIER' : 'MEMOS'}.DELETE.HEADER`),
                message: this.translate.instant(`${this.isDossier ? 'MEMOS_DOSSIER' : 'MEMOS'}.DELETE.MESSAGE`),
                done: async () => {
                    this.deleteFiles(filesNames, () => {
                        this.memos.splice(index, 1);
                        this.emitSaveMemo();
                    });
                },
                cancel: () => { }
            }
        );
    }

    /**
     * edit memo
     */
    editMemo(index: number) {
        const data = {
            memo: this.isDossier ? null : CopyHelper.copy(this.memos[index]),
            memoDossier: this.isDossier ? CopyHelper.copy(this.memos[index]) : null,
            title: this.isDossier ? 'MEMOS_DOSSIER.EDIT' : 'MEMOS.EDIT',
            isDossier: this.isDossier
        };
        DialogHelper.openDialog(this.modalController, AddMemoComponent, data).then(async (result) => {
            if (!StringHelper.isEmptyOrNull(result) && result as AddMemoModalOutput) {
                await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
                FileHelper.uploadMemo(this.fileManagerService, result.memo, async (memo: Memo) => {
                    this.memos[index] = memo;
                    await this.loadingService.hide();
                    this.emitSaveMemo();
                }, async () => {
                    await this.loadingService.hide();
                    this.errorUpload();
                });

                if (result.removedFiles.length > 0) {
                    this.deleteFiles(result.removedFiles.map(e => e.name), () => null);
                }
            }
        });
    }

    //#endregion

    //#region events

    /**
     * remove file
     */
    removeFile(memoIndex: number, pieceJointIndex: number) {
        const fileName = this.memos[memoIndex].pieceJointes[pieceJointIndex].name;
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('MEMOS.DELETE_FILE.HEADER'),
                message: this.translate.instant('MEMOS.DELETE_FILE.MESSAGE'),
                done: async () => {
                    this.deleteFiles([fileName], () => {
                        this.memos[memoIndex].pieceJointes.splice(pieceJointIndex, 1);
                        this.emitSaveMemo();
                    });
                },
                cancel: () => null
            }
        );
    }

    /**
     * back click
     */
    backClick() {
        this.cancelEvent.emit();
    }

    //#endregion

    //#region services

    /**
     * display file
     */
    displayFile(piece: PieceJoin) {
        FileHelper.displayPieceJoin(
            this.fileManagerService,
            piece,
            async () => await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT')),
            async () => await this.loadingService.hide(),
            (error: any) => this.errorServer());
    }

    /**
     * download file
     */
    downloadFile(piece: PieceJoin) {
        FileHelper.downloadPieceJoin(
            this.fileManagerService,
            piece,
            async () => await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT')),
            async () => await this.loadingService.hide(),
            (error: any) => this.errorServer());
    }

    private async deleteFiles(filesNames: string[], callbackSuccess: () => void) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.fileManagerService.DeleteList(filesNames).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastService.presentToast({
                    message: this.translate.instant('SUCCESS.DELETE'), type: ToastTypes.Success
                });
                callbackSuccess();
            } else {
                this.errorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    //#endregion

    //#region helpers

    emitSaveMemo() {
        this.saveMemoEvent.emit(this.memos);
    }

    private errorServer() {
        this.toastService.presentToast({
            message: this.translate.instant('ERRORS.SERVER'), type: ToastTypes.Danger
        });
    }

    private errorUpload() {
        this.toastService.presentToast({
            message: this.translate.instant('ERRORS.UPLOAD_FILE'), type: ToastTypes.Danger
        });
    }
    //#endregion

}
