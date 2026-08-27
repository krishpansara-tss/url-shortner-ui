import { TestBed } from '@angular/core/testing';
import { Urls } from './urls';

describe('Urls', () => {
  let service: Urls;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Urls);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
