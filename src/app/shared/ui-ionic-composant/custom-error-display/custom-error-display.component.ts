import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custom-error-display',
  template: `
              <p ion-text color="danger" style="margin-top: 5px;margin-bottom:5px;">
                <ion-text color="danger" class="form-errors">
                  <ng-container *ngIf="control && control.errors && (control.dirty || control.touched)">
                  <ng-container *ngIf="control.errors['required']">{{ 'ERRORS.REQUIRED' | translate }}</ng-container>
                  <ng-container *ngIf="control.errors['unique']">{{ 'ERRORS.CHECK_UNIQUE' | translate }}</ng-container>
                  <ng-container *ngIf="control.errors['lessThen']">{{ 'ERRORS.MIN_LENGTH' | translate }}</ng-container>
                  <ng-container *ngIf="control.errors['pattern']">{{ 'ERRORS.PATTERN' | translate }}</ng-container>
                  <ng-container *ngIf="control.errors['minlength']">
                    {{ 'ERRORS.MIN_LENGTH'  | translate:{number:control.errors['minlength'].requiredLength} }}
                  </ng-container>
                  <ng-container *ngIf="control.errors['checkValidAmount']">{{ 'ERRORS.INVALID_AMOUNT' | translate }}</ng-container>
                  </ng-container>
                </ion-text>
              </p>`
})
export class CustomErrorDisplayComponent implements OnInit {

  @Input() control: AbstractControl;

  constructor() { }

  ngOnInit() { }

}
