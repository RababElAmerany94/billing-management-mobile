import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteName } from './core/enums/route.enum';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'forget-password',
        loadChildren: () => import('./pages/auth/forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
    },
    {
        path: RouteName.Dashboard,
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
    },
    {
        path: RouteName.Clients,
        loadChildren: () => import('./pages/clients/client.module').then(m => m.ClientModule)
    },
    {
        path: RouteName.Dossier,
        loadChildren: () => import('./pages/dossier/dossier.module').then(m => m.DossierModule)
    },
    {
        path: RouteName.Devis,
        loadChildren: () => import('./pages/devis/devis.module').then(m => m.DevisModule)
    },
    {
        path: RouteName.BonCommande,
        loadChildren: () => import('./pages/bon-commande/bon-commande.module').then(m => m.BonCommandeModule)
    },
    {
        path: RouteName.AgendaCommercial,
        loadChildren: () => import('./pages/agenda-commercial/agenda-commercial.module').then(m => m.AgendaCommercialModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
