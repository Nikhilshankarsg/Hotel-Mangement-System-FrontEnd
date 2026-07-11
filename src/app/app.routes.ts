import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rooms',
    loadComponent: () => import('./features/rooms/rooms.component').then(m => m.RoomsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checkinout',
    loadComponent: () => import('./features/checkinout/checkinout.component').then(m => m.CheckinoutComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
