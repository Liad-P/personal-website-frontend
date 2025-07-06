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

  ngOnInit(): void {
    this.addBackendMessageToTerminal("Welcome to my personal website!");
    this.addBackendMessageToTerminal("Type 'help' for a list of available commands.");
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

  addTextMessageWithUserInput() {
    this.addUserMessageToTerminal(this.userInput);
    this.userInput = "";
  }

}

interface TerminalMessage{
  id: number,
  owner: string,
  message: string
}
