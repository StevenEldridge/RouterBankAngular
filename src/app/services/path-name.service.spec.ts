import { TestBed } from '@angular/core/testing';

import { PathNameService } from './path-name.service';

describe('PathNameService', () => {
  let service: PathNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
