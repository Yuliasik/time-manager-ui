import { TestBed } from '@angular/core/testing';

import { RequestInterceptor } from './request-interceptor.service';

describe('RequesInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RequestInterceptor = TestBed.inject(RequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
