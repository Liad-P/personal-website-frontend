import { TestBed } from '@angular/core/testing';

import { AiBackend } from '../ai-backend';

describe('AiBackend', () => {
  let service: AiBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
