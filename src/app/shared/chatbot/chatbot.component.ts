import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  open = false;
  input = '';
  loading = false;

  messages: ChatMessage[] = [
    { sender: 'bot', text: 'Hi! I\'m your hotel assistant. Ask me about room availability, occupancy, or check-in/check-out.' }
  ];

  constructor(private chatbotService: ChatbotService) {}

  toggle() {
    this.open = !this.open;
  }

  send() {
    const text = this.input.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });
    this.input = '';
    this.loading = true;

    this.chatbotService.sendMessage(text).subscribe({
      next: (res) => {
        this.chatbotService.setSessionId(res.sessionId);
        this.messages.push({ sender: 'bot', text: res.reply });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ sender: 'bot', text: 'Sorry, I could not process that right now.' });
        this.loading = false;
      }
    });
  }
}
