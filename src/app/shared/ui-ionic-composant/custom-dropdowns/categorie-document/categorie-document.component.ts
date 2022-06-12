import { Component, OnInit } from '@angular/core';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { ICategoryDocument } from 'src/app/core/models/general/category-document.model';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { CategoryDocumentService } from 'src/app/core/services/category-document.service';

@Component({
  selector: 'app-categorie-document',
  template: `
  <ng-container *ngIf="loaded">
    <ion-item [formGroup]="formInstant"  class="{{customInput}}">
      <ion-label>{{label}}</ion-label>
      <ion-select [id]="inputName" interface="popover" [formControlName]="inputName">
        <ion-select-option *ngFor="let item of categoryDocuments" [value]="item.id">
        {{item?.name }}
        </ion-select-option>
      </ion-select>
    </ion-item>
    <app-custom-error-display [control]="control"></app-custom-error-display>
  </ng-container>
  `
})
export class CategorieDocumentComponent  extends BaseUiCustomComponent implements OnInit {

  /** list of categoryDocument */
  categoryDocuments: ICategoryDocument[] = [];

  /** is data loaded */
  loaded = false;

  constructor(
    private categoryDocumentService: CategoryDocumentService
  ) { super(); }

  ngOnInit() {
    this.getCategoryDocument();
  }

  /**
   * get list category of Document
   */
  getCategoryDocument() {
    this.categoryDocumentService.GetAsPagedResult({
      SearchQuery: '',
      OrderBy: 'id',
      SortDirection: SortDirection.Asc,
      Page: 1,
      PageSize: AppSettings.MAX_GET_DATA
    }).subscribe(result => {
      this.categoryDocuments = result.value;
      this.loaded = true;
    });
  }

}
