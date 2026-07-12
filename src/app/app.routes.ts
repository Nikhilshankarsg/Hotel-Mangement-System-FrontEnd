import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // Main Landing Page (localhost:4200)
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing')
        .then(m => m.Landing)
  },
  // Admin Login (localhost:4200/login)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component')
        .then(m => m.LoginComponent)
  },

  // Admin Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  // Rooms
  {
    path: 'rooms',
    loadComponent: () =>
      import('./features/rooms/rooms.component')
        .then(m => m.RoomsComponent),
    canActivate: [authGuard]
  },

  // Check-In / Check-Out
  {
    path: 'checkinout',
    loadComponent: () =>
      import('./features/checkinout/checkinout.component')
        .then(m => m.CheckinoutComponent),
    canActivate: [authGuard]
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: ''
  }

];