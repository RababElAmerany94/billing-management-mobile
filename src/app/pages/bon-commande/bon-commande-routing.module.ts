import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonCommandeShellComponent } from './container/bon-commande-shell/bon-commande-shell.component';

const routes: Routes = [
    {
        path: '',
        component: BonCommandeShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BonCommandeRoutingModule { }
