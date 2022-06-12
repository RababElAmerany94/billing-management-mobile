import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { IsForAgenceDirective } from './is-for-agence.directive';

@NgModule({
  declarations: [
    HasRoleDirective,
    IsForAgenceDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HasRoleDirective,
    IsForAgenceDirective
  ]
})
export class DirectiveModule { }
