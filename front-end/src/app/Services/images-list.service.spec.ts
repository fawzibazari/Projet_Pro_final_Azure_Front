import { TestBed } from '@angular/core/testing';

import { ImagesListService } from './images-list.service';

describe('ImagesListService', () => {
  let service: ImagesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
