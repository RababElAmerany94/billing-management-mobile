import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DateHelper } from 'src/app/core/helpers/date';
import { FileHelper } from 'src/app/core/helpers/file';
import { StringHelper } from 'src/app/core/helpers/string';
import { UserHelper } from 'src/app/core/helpers/user';
import { ValidationUtils } from 'src/app/core/helpers/validation';
import { AddMemoModalOutput, Memo } from 'src/app/core/models/general/memo.model';
import { PieceJoin } from 'src/app/core/models/general/pieceJoin.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { ICategoryDocument } from '../../../core/models/general/category-document.model';
import { MemoDossier } from '../../../core/models/general/memo-dossier.model';

@Component({
    selector: 'app-add-memo',
    templateUrl: './add-memo.component.html',
    styleUrls: ['../../../../assets/components/input.scss', './add-memo.component.scss'],
})
export class AddMemoComponent implements OnInit {

    form: FormGroup;
    title = 'MEMOS.ADD';
    pieceJointes: PieceJoin[] = [];
    currentCategory: ICategoryDocument;
    isDossier = false;

    // edit memo
    editMemo: Memo;
    editMemoDossier: MemoDossier;
    removedFiles: PieceJoin[] = [];

    constructor(
        private fb: FormBuilder,
        private toasterService: ToastService,
        public modalController: ModalController,
        private translate: TranslateService,
        private navParams: NavParams,
        private actionSheetController: ActionSheetController,
        private camera: Camera
    ) {
        this.isDossier = this.navParams.get('isDossier');
        this.title = this.navParams.get('title');
        this.editMemo = this.navParams.get('memo');
        this.editMemoDossier = this.navParams.get('memoDossier');
    }

    ngOnInit() {
        this.initializeForm();
    }

    //#region forms

    private initializeForm() {
        if (this.isDossier) {
            this.currentCategory = this.editMemoDossier ? this.editMemoDossier.category : null;
            this.form = this.fb.group({
                commentaire: [this.editMemoDossier ? this.editMemoDossier.commentaire : null, [Validators.required]],
                name: [this.editMemoDossier ? this.editMemoDossier.name : null, [Validators.required]],
                category: [this.currentCategory ? this.currentCategory.id : null, [Validators.required]],
            });
        } else {
            this.form = this.fb.group({
                commentaire: [this.editMemo ? this.editMemo.commentaire : null, [Validators.required]]
            });
        }
    }

    //#endregion

    //#region private methods and helpers


    //#endregion

    //#region save changes

    save(): void {
        if (this.form.valid) {
            const data: AddMemoModalOutput = {
                memo: this.buildMemoObject(),
                removedFiles: this.removedFiles
            };
            this.modalController.dismiss(data);
        } else {
            this.toasterService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL') });
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helpers

    setCategory(category: ICategoryDocument) {
        this.currentCategory = category;
    }

    private creationMemo(): Memo {
        if (this.editMemo == null) {
            return {
                commentaire: this.form.value.commentaire,
                date: DateHelper.formatDateTime(new Date().toString()),
                pieceJointes: this.pieceJointes,
                userId: UserHelper.getUserId()
            };
        } else {
            return {
                ...this.editMemo,
                pieceJointes: [...this.editMemo.pieceJointes, ...this.pieceJointes],
                commentaire: this.form.value.commentaire
            };
        }
    }

    private creationMemoDossier(): MemoDossier {
        if (this.editMemoDossier == null) {
            return {
                commentaire: this.form.value.commentaire,
                name: this.form.value.name,
                category: this.currentCategory,
                date: DateHelper.formatDateTime(new Date().toString()),
                pieceJointes: this.pieceJointes,
                userId: UserHelper.getUserId()
            }
                ;
        } else {
            return {
                ...this.editMemoDossier,
                pieceJointes: [...this.editMemo.pieceJointes, ...this.pieceJointes],
                commentaire: this.form.value.commentaire,
                name: this.form.value.name,
                category: this.currentCategory
            };
        }
    }

    removeNewFile(index: number) {
        this.pieceJointes.splice(index, 1);
    }

    removeOldFile(index: number) {
        const removedFile = this.isDossier ?
            this.editMemoDossier.pieceJointes.splice(index, 1) :
            this.editMemo.pieceJointes.splice(index, 1);
        this.removedFiles = [...this.removedFiles, ...removedFile];
    }

    buildMemoObject() {
        const memo: Memo = this.isDossier ? this.creationMemoDossier() : this.creationMemo();
        return memo;
    }

    async onSelect() {
        const actionSheet = await this.actionSheetController.create({
            header: this.translate.instant('LABELS.FROM'),
            buttons: [
                {
                    text: this.translate.instant('LABELS.LIBRARY'),
                    icon: 'folder-outline',
                    handler: () => this.chooseFile()
                },
                {
                    text: this.translate.instant('LABELS.TAKE_PICTURE'),
                    icon: 'camera-outline',
                    handler: () => this.takePicture()
                }
            ]
        });
        await actionSheet.present();
    }

    private takePicture(): void {
        FileHelper.takePicture(this.camera).then(async (base64: string) => {
            const pieceJoin = {
                name: StringHelper.guid(),
                type: 'image/jpeg',
                orignalName: `${DateHelper.getNowDateForIdentityValue()}.jpeg`,
                file: base64
            };
            this.pieceJointes.push(pieceJoin);
        });
    }

    private chooseFile() {
        FileHelper.chooseFile().then((pieceJoin: PieceJoin) => {
            if (pieceJoin !== undefined) {
                if (!ValidationUtils.validationSize(pieceJoin.size)) {
                    this.toasterService.presentToast({ message: this.translate.instant('ERRORS.SIZE') });
                    return;
                } else {
                    this.pieceJointes.push(pieceJoin);
                }
            }
        });
    }

    //#endregion
}
