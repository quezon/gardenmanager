import { TestBed } from '@angular/core/testing';

import { ImageConverterService } from './image-converter.service';

describe('ImageConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageConverterService = TestBed.get(ImageConverterService);
    expect(service).toBeTruthy();
  });
});
