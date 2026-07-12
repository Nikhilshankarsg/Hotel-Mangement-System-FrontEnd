import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

  activeTab: 'home' | 'about' = 'home';

  showHome() {
    this.activeTab = 'home';
  }

  showAbout() {
    this.activeTab = 'about';
  }
}