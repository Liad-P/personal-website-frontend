import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class Terminal implements OnInit {

  currentMessageID: number = 0;

  messages: TerminalMessage[] = [];

  userInput: string = "";
  isStreaming: boolean = false;

  ngOnInit(): void {
    this.streamBackendMessage("Welcome to my personal website!")
      .then(() => {
          return this.streamBackendMessage("Type 'help' to see available commands.");
        }
      );
  }

  addUserMessageToTerminal(inputMessage: string) {
    this.addMessageWithOwner(inputMessage, "User");
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
    this.userInput = "";
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
  }

  autoResize(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }

}

interface TerminalMessage{
  id: number,
  owner: string,
  message: string
}

