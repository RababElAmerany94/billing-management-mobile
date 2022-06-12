import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientShellComponent } from './container/client-shell/client-shell.component';


const routes: Routes = [
  {
    path: '',
    component: ClientShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
