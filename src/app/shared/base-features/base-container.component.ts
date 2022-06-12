import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { Access } from 'src/app/core/enums/access.enum';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { RouteName } from 'src/app/core/enums/route.enum';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';
import { StringHelper } from 'src/app/core/helpers/string';
import { UserHelper } from 'src/app/core/helpers/user';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { SubSink } from 'subsink';
import { BasePermissions } from './base-permission.component';

@Component({
    selector: 'app-base-container',
    template: ''
})
export class BaseContainerComponent extends BasePermissions implements OnInit {

    /** is navigation route */
    @Input()
    isNavigationRoute = false;

    /** sub sink  */
    subs = new SubSink();

    /** modes routing */
    modes: typeof ModeEnum = ModeEnum;

    /** default mode  */
    mode = ModeEnum.List;

    /** form group */
    form: FormGroup;

    /** userProfile type */
    userProfile: typeof UserProfile = UserProfile;

    stringHelper: typeof StringHelper = StringHelper;

    /** filter options list  */
    filterOption: IFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** test if display loader or not */
    loading = false;

    /** the routes name */
    routeName = RouteName;

    constructor(
        protected toastService: ToastService,
        protected translate: TranslateService,
        protected router: Router,
        protected location: Location
    ) {
        super();
    }

    ngOnInit() { }

    // #region modes
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    isListMode = () => this.mode === ModeEnum.List;
    // #endregion

    //#region changes modes

    modeEdit(id: string) {
        if (UserHelper.hasPermission(this.module, Access.Update)) {
            this.mode = ModeEnum.Edit;
            if (!this.isNavigationRoute) {
                this.router.navigate([], { queryParams: { mode: this.mode, id } });
            }
        } else {
            this.goHome();
        }
    }

    modeAdd(mode: number = ModeEnum.Add) {
        if (UserHelper.hasPermission(this.module, Access.Create)) {
            this.mode = ModeEnum.Add;
            if (!this.isNavigationRoute) {
                this.router.navigate([], { queryParams: { mode } });
            }
        } else {
            this.goHome();
        }
    }

    modeShow(id: string) {
        if (UserHelper.hasPermission(this.module, Access.Read)) {
            this.mode = ModeEnum.Show;
            if (!this.isNavigationRoute) {
                this.router.navigate([], { queryParams: { mode: this.mode, id } });
            }
        } else {
            this.goHome();
        }
    }

    modeList() {
        if (UserHelper.hasPermission(this.module, Access.Read)) {
            this.mode = ModeEnum.List;
            if (!this.isNavigationRoute) {
                this.router.navigate([], { queryParams: { mode: this.mode } });
            }
        } else {
            this.goHome();
        }
    }

    //#endregion

    //#region toasts

    toastErrorServer = () =>
        this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER'), type: ToastTypes.Danger })
    toastAddSuccess = () =>
        this.toastService.presentToast({ message: this.translate.instant('SUCCESS.ADD'), type: ToastTypes.Success })
    toastEditSuccess = () =>
        this.toastService.presentToast({ message: this.translate.instant('SUCCESS.EDIT'), type: ToastTypes.Success })
    toastSaveSuccess = () =>
        this.toastService.presentToast({ message: this.translate.instant('SUCCESS.SAVE'), type: ToastTypes.Success })
    toastDeleteSuccess = () =>
        this.toastService.presentToast({ message: this.translate.instant('SUCCESS.DELETE'), type: ToastTypes.Success })
    toastSyncSuccess = () =>
        this.toastService.presentToast({ message: this.translate.instant('SUCCESS.SUCCESS_SYNC'), type: ToastTypes.Success })

    //#endregion

    //#region helpers

    private goHome() {
        this.router.navigateByUrl('/');
    }

    //#endregion

}
