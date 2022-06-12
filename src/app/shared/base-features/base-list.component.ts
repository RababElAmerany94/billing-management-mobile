import { Component, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { SubSink } from 'subsink';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { RouteName } from 'src/app/core/enums/route.enum';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';
import { FormGroup } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { BasePermissions } from './base-permission.component';

@Component({
    selector: 'app-base-list',
    template: ''
})
export class BaseListComponent<IModel, IKey> extends BasePermissions implements OnDestroy {

    subs = new SubSink();

    /** name of model */
    @Input()
    name: string;

    /** filter emitter */
    @Output()
    filters = new EventEmitter<IFilterOption>();

    /** add emitter */
    @Output()
    addEvent = new EventEmitter();

    /** edit emitter */
    @Output()
    editEvent = new EventEmitter<IModel>();

    /** show emitter */
    @Output()
    showEvent = new EventEmitter<IModel>();

    /** delete emitter */
    @Output()
    deleteEvent = new EventEmitter<IKey>();

    /** display loader */
    @Input()
    loading = false;

    /** the routes name */
    routeName = RouteName;

    /** user profile */
    userRole = UserProfile;

    /** form group */
    form: FormGroup;

    /** skeleton length for loading data */
    skeletonLength = new Array(30).fill(0);

    /** the number of page */
    pageCount = 1;

    /** page number */
    page = 1;

    /** filter option state */
    filterOption: IFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    finished = false;

    constructor() {
        super();
    }

    // #region click events

    /**
     * click add button
     */
    addClick() {
        this.addEvent.emit();
    }

    /**
     * edit button click
     */
    editClick(model: IModel) {
        this.editEvent.emit(model);
    }

    /**
     * show button click
     */
    showClick(model: IModel) {
        this.showEvent.emit(model);
    }

    //#endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    //#region search

    changeFiltersEvent(filterOption: IFilterOption) {
        this.filters.emit(filterOption);
    }
    ////#endregion

}
