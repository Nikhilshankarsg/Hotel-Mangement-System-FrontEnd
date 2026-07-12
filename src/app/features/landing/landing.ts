import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// 1. Import the Chatbot Component
import { ChatbotComponent } from '../../shared/chatbot/chatbot.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  // 2. Add ChatbotComponent to the imports array
  imports: [CommonModule, RouterLink, ChatbotComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  activeTab: 'home' | 'about' = 'home';

  showHome(): void {
    this.activeTab = 'home';
  }

  showAbout(): void {
    this.activeTab = 'about';
  }
}