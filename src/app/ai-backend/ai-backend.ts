import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AiBackend {
  constructor() { }

  private http = inject(HttpClient);

  generateResponse(input: string): Observable<AIResponse> {
    const body = {
      "prompt": input
    };
    return this.http.post<AIResponse>(`${environment.apiUrl}/chat`, body);
  }
  
}

export interface AIResponse{
  AiResponse: string
}