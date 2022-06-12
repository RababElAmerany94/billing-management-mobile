import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { UserHelper } from 'src/app/core/helpers/user';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['../../../assets/components/lists.scss']
})
export class DataListComponent implements OnInit {

    @Input()
    title: string;

    @Input()
    name: string;

    @Input()
    loading = false;

    @Input()
    isBack = false;

    @Input()
    isDataSelector = false;

    @Input()
    isSideBar = true;

    @Input()
    isValidation = false;

    @Input()
    classCss = '';

    @Input()
    isAdd = false;

    @Input()
    set data(result: IPagedResult<any>) {
        if (result == null) {
            this.isEmpty = true;
            this.pageCount = 0;
        } else {
            this.isEmpty = result.currentPage === 1 && result.value.length === 0;
            this.pageCount = result.pageCount;
        }
    }

    @Output()
    changeEvent = new EventEmitter<IFilterOption>();

    @Output()
    backClickEvent = new EventEmitter();

    @Output()
    addClickEvent = new EventEmitter();

    @Output()
    validationClickEvent = new EventEmitter();

    /** page count of list */
    pageCount: number;

    /** test if loading list is finished or not */
    finished = false;

    /** skeleton length for loading data */
    skeletonLength = new Array(30).fill(0);

    /** the filter options of data list */
    filterOption: IFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    isEmpty = false;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.retrieveState();
        }, 300);
    }

    //#region emit change value / recovery search value

    emitChange() {
        this.changeEvent.emit(this.filterOption);
    }

    searchValue(searchQuery: string) {
        this.filterOption.SearchQuery = searchQuery;
        this.saveState();
    }

    //#endregion

    // #region save and retrieve state

    saveState() {
        localStorage.setItem(`state_${UserHelper.getUserId()}_${this.name}`, JSON.stringify(this.filterOption));
        this.emitChange();
    }

    retrieveState() {
        const oldState = localStorage.getItem(`state_${UserHelper.getUserId()}_${this.name}`);
        if (oldState != null && oldState !== '') {
            this.filterOption = JSON.parse(oldState);
        }
        this.emitChange();
    }

    // #endregion

    //#region loading more data

    /** load more data */
    loadMoreData(infiniteScroll: any) {
        if (this.filterOption.Page === this.pageCount) {
            this.finished = true;
            infiniteScroll.disabled = true;
        } else {
            this.finished = false;
            this.filterOption.Page += 1;
            this.emitChange();
            infiniteScroll.target.complete();
        }
    }

    //#endregion


    //#region helper

    backClick() {
        this.backClickEvent.emit();
    }

    addClick() {
        this.addClickEvent.emit();
    }

    validationClick() {
        this.validationClickEvent.emit();
    }

    //#endregion
}
