import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    /* * The searchbar state */
    @Input()
    showSearchbar = false;

    /* * The title of the header */
    @Input()
    title = '';

    /** the search value */
    @Input()
    searchValue = '';

    /*** The color of the header */
    @Input()
    color = 'primary';

    /*** Whether or not to add the sidebar button*/
    @Input()
    sidebar = true;

    /*** Whether or not to add the close button */
    @Input()
    close = false;

    /*** Whether or not to add the back button*/
    @Input()
    back = false;

    /*** Whether or not to add the search button */
    @Input()
    search = false;

    /*** Whether or not to add the home button*/
    @Input()
    home = false;

    /*** Whether or not to add the validation button*/
    @Input()
    validation = false;

    /*** Whether or not to add the popup-expand button*/
    @Input()
    more = false;

    /*** add or not the add button*/
    @Input()
    add = false;

    /** enable search icon */
    @Input()
    enableSearchIcon = true;

    /*** Whether or not to show the validation button */
    @Input()
    showValidationButton = false;

    /** test if the component whose display is modal or not */
    @Input()
    modalMode = false;

    /*** The close click event*/
    @Output()
    closeClick = new EventEmitter<void>();

    /*** The back click event */
    @Output()
    backClick = new EventEmitter<void>();

    /** The validation click event */
    @Output()
    validationClick = new EventEmitter<void>();

    /*** The more click event */
    @Output()
    moreClick = new EventEmitter<void>();

    /*** The add click event */
    @Output()
    addClick = new EventEmitter<void>();

    /*** The search update event */
    @Output()
    searchEvent = new EventEmitter<string>();

    /*** The search clear event */
    @Output()
    searchClear = new EventEmitter<void>();

    constructor(
        public sidebarService: SidebarService,
        public platform: Platform,
        public modalController: ModalController,
    ) { }

    /**
     * test if display search bar or not
     */
    onSearchClicked(): void {
        if (this.search) {
            this.showSearchbar = !this.showSearchbar;
        }
    }

    /**
     * the close click event
     */
    onCloseClicked(): void {
        this.closeClick.emit();
    }

    /**
     * the validation click event
     */
    onValidationClicked(): void {
        this.validationClick.emit();
    }

    /**
     * the more click event
     */
    onMoreClicked(e: any): void {
        this.moreClick.emit(e);
    }

    /**
     * the add click event
     */
    onAddClicked(e: any): void {
        this.addClick.emit(e);
    }

    /**
     * the close click
     */
    async onBackClicked(): Promise<void> {
        this.backClick.emit();
    }

    /**
     * display title
     */
    getTitle = () => this.title ? this.title : '';

    /**
     * target search value
     */
    onSearch(keyword: string): void {
        this.searchEvent.emit(keyword);
    }

}
