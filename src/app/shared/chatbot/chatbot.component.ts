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

  // Keep your existing send() method
send() {
  const text = this.input.trim();
  if (!text) return;

  // 1. Add user message and clear input
  this.messages.push({ sender: 'user', text });
  this.input = '';
  this.loading = true; // Show "Typing..."

  // 2. Call the service
  this.chatbotService.sendMessage(text).subscribe({
    next: (res) => {
      // 3. Stop loading
      this.loading = false;
      
      // 4. Push the reply from the backend
      if (res && res.reply) {
        this.messages.push({ sender: 'bot', text: res.reply });
      } else {
        this.messages.push({ sender: 'bot', text: 'I received an empty response from the server.' });
      }
    },
    error: (err) => {
      console.error('Chatbot Error:', err);
      this.loading = false; // Important: Stop loading even on error
      this.messages.push({ sender: 'bot', text: 'Sorry, I am having trouble connecting to the hotel server.' });
    }
  });
}
}
