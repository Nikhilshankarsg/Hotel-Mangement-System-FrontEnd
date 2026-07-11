import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentBaseUrl } from '../../app.environment';

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private baseUrl = `${environmentBaseUrl}/api/chatbot`;
  private sessionId: string | null = null;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/message`, {
      message,
      sessionId: this.sessionId
    });
  }

  setSessionId(id: string) {
    this.sessionId = id;
  }
}
