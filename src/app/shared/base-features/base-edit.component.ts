import { Component, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { FormGroup } from '@angular/forms';
import { UserHelper } from 'src/app/core/helpers/user';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';

@Component({
    selector: 'app-base-edit',
    template: ''
})
export class BaseEditComponent<IModel> implements OnDestroy {

    subs = new SubSink();

    /** add event */
    @Output()
    addEvent = new EventEmitter<IModel>();

    /** edit event */
    @Output()
    editEvent = new EventEmitter<IModel>();

    /** cancel event */
    @Output()
    cancelEvent = new EventEmitter();

    /** the mode of component */
    @Input()
    mode: ModeEnum;

    /** the form group */
    @Input()
    form: FormGroup;

    @Input()
    isNavigationRoute = false;

    /** an enumeration define list of roles */
    userRole = UserProfile;

    constructor() { }

    /**
     * cancel edit
     */
    cancel() {
        this.cancelEvent.emit();
    }

    // #region view helpers
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    userId = () => UserHelper.getUserId();
    // #endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    /** display header title */
    displayHeaderTitle() {
        switch (true) {
            case this.isAddMode():
                return 'ADD.TITLE';

            case this.isEditMode():
                return 'EDIT.TITLE';

            case this.isShowMode():
                return 'SHOW.TITLE';

            default:
                break;
        }
    }
}
