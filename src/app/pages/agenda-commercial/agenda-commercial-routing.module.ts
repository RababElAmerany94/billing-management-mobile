import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaCommercialShellComponent } from './container/agenda-commercial-shell/agenda-commercial-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AgendaCommercialShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaCommercialRoutingModule { }
