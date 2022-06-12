import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StringHelper } from 'src/app/core/helpers/string';
import { ResultStatus } from '../../../core/enums/result-status';
import { UserProfile } from '../../../core/enums/user-roles.enum';
import { IUserFilterOption } from '../../../core/models/general/filter-option.model';
import { IPagedResult } from '../../../core/models/general/result-model';
import { IUser } from '../../../core/models/user/userModel';
import { ToastService } from '../../../core/services/toast.service';
import { UsersService } from '../../../core/services/user-service/users.service';
import { BaseListComponent } from '../../base-features/base-list.component';

@Component({
    selector: 'app-select-users',
    templateUrl: './select-users.component.html'
})
export class SelectUsersComponent extends BaseListComponent<IUser, number>  {

    @Input()
    isAll = true;

    title = 'DATA_SELECTOR.SELECT_CONTROLEUR';
    rolesId: UserProfile[] = [];
    userAsPage: IPagedResult<IUser>;
    users: IUser[] = [];
    selectedUserId: string;
    showAny = false;

    constructor(
        private userService: UsersService,
        private toastService: ToastService,
        public modalController: ModalController,
        private translate: TranslateService,
        private navParams: NavParams,
    ) {
        super();
        this.rolesId = this.navParams.get('rolesId') as UserProfile[];
        this.showAny = this.navParams.get('showAny') as boolean;
        if (!StringHelper.isEmptyOrNull(this.navParams.get('title'))) {
            this.title = this.navParams.get('title');
        }
    }

    //#region services

    async getUsers(filterOption: IUserFilterOption) {
        if (this.rolesId == null) {
            filterOption.isAll = this.isAll;
        } else {
            filterOption.rolesId = this.rolesId;
        }
        this.loading = true;
        this.subs.sink = this.userService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.loading = false;
                if (result.status === ResultStatus.Succeed) {
                    this.userAsPage = result;
                    if (this.userAsPage.currentPage === 1) {
                        this.users = [];
                    }
                    this.users = [...this.users, ...result.value];

                } else {
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
                    this.loading = false;
                }
            });
    }

    //#endregion services

    //#region helpers

    async chooseUser() {
        const user = this.users.find(e => e.id === this.selectedUserId);
        await this.modalController.dismiss(user);
    }

    selectUser(id: string) {
        this.selectedUserId = id;
    }

    //#endregion

}
