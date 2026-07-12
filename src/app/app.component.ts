import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { ChatbotComponent } from './shared/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive, /* Added to power the active state styling */
    CommonModule,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isAdminPage = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;

        this.isAdminPage =
          url.startsWith('/dashboard') ||
          url.startsWith('/rooms') ||
          url.startsWith('/checkinout');
      });
  }

  // Generates 2-letter initials for the avatar (e.g., "John Doe" -> "JD")
  get userInitials(): string {
    const fullName = this.auth.getFullName() || 'Admin User';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/main']);
  }
}