import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { ChatMessage } from '../model/chat';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient?: Stomp.Client;
  private messageSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
  private messages: ChatMessage[] = [];

  constructor() {}

  initializeWebSocketConnection() {
    const socket = new SockJS('http://localhost:8080/skyjo/websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.stompClient?.subscribe('/topic/public', (message) => {
        if (message.body) {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          this.messageSubject.next(receivedMessage);
        }
      });
    });
  }

  sendMessage(message: ChatMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(message)
      );
    } else {
      console.error('Stomp client is not initialized or not connected.');
    }
  }

  addUser(message: ChatMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/chat.addUser', {}, JSON.stringify(message));
      this.messages.push(message);
    } else {
      console.error('Stomp client is not initialized or not connected.');
    }
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }
  subscribeToMessages(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }
}
