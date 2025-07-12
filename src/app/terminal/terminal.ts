import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiBackend, AIResponse } from '../ai-backend/ai-backend';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class Terminal implements OnInit {

  private aiBackend = inject(AiBackend);

  currentMessageID: number = 0;

  messages: TerminalMessage[] = [];

  userInput: string = "";
  isStreaming: boolean = false;
  waitingForBackendMessage = false;

  ngOnInit(): void {
    this.streamBackendMessage("Welcome to my personal website!")
      .then(() => {
          return this.streamBackendMessage("Type 'help' to see available commands.");
        }
      );
  }

  addUserMessageToTerminal(inputMessage: string) {
    if (this.waitingForBackendMessage) {
      return;
    }
    const result = this.getAIResponseToPrompt(inputMessage);
    this.waitingForBackendMessage = true;
    result.subscribe({
      next: value => {
        this.addMessageWithOwner(inputMessage, "User");
        this.userInput = ""
        this.streamBackendMessage(value.AiResponse);
        this.waitingForBackendMessage = false;
      },
      error: err => {
        console.error('Error:', err);
        this.addMessageWithOwner(inputMessage, "User");
        this.userInput = ""
        this.streamBackendMessage("Error connecting to backend server.");
      },
      complete: () => this.waitingForBackendMessage = false
    })
  }

  addMessageWithOwner(inputMessage: string, inputOwner: string) {
    this.messages.push({
      id: this.currentMessageID,
      owner: inputOwner,
      message: inputMessage
    });
    this.currentMessageID += 1;
  }

  addBackendMessageToTerminal(inputMessage: string) {
    this.addMessageWithOwner(inputMessage, "Backend");
  }

  streamBackendMessage(inputMessage: string): Promise<void> {
    this.isStreaming = true;
    this.addBackendMessageToTerminal("");
    const messageIndex = this.messages.length - 1;
    let charIndex = 0;
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (charIndex < inputMessage.length) {
          this.messages[messageIndex].message += inputMessage[charIndex];
          charIndex++;
        } else {
          clearInterval(interval);
          this.isStreaming = false;
          resolve();
        }
      }, 20);
    });
  }

  addTextMessageWithUserInput(event: Event) {
    if (this.isStreaming) return;
    this.addUserMessageToTerminal(this.userInput);
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
  }

  autoResize(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }

  getAIResponseToPrompt(prompt: string): Observable<AIResponse> {
    const response = this.aiBackend.generateResponse(prompt);
    return response;
  }

}

interface TerminalMessage{
  id: number,
  owner: string,
  message: string
}

