import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWrapperComponent } from './file-wrapper.component';

describe('FileWrapperComponent', () => {
  let component: FileWrapperComponent;
  let fixture: ComponentFixture<FileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
