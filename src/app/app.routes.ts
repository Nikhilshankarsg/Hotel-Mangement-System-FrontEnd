import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Main Landing Page
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
  },
  // Public Chatbot Route
//   {
//   path: 'chatbot',
//   // Change the path here to match the actual folder structure
//   loadComponent: () => import('./shared/chatbot/chatbot.component').then(m => m.ChatbotComponent)
// },
  // Login
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  // Protected Admin Routes
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
  { path: '**', redirectTo: '' }
];