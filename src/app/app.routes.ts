import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        title: `${document.title} · Dashboard`,
        loadComponent: () => import('./dashboard/dashboard.component').then(mod => mod.DashboardComponent),
    },
    {
        path: '',
        title: `${document.title} · Home Page`,
        loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];
