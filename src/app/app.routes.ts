import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardComponent,
    },
    {
        path: '',
        title: 'Home Page',
        component: HomeComponent,
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];
