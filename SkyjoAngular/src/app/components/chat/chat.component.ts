import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/model/chat';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: ChatMessage[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.initializeWebSocketConnection();

    this.chatService.subscribeToMessages().subscribe(
      (receivedMessage) => {
        this.messages.push(receivedMessage);
      },
      (error) => {
        console.error('WebSocket Error:', error);
      }
    );
  }

  get login(): string {
    return localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('compte')!).login
      : '';
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      if (!this.login) {
        console.error('Login is not defined. Unable to send message.');
        return;
      }

      const message: ChatMessage = {
        sender: this.login,
        content: this.newMessage,
      };

      this.chatService.sendMessage(message);
      this.newMessage = ''; // Efface le champ de saisie après l'envoi du message
    }
  }
}
