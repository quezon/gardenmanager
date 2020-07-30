import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeNgTreeTableComponent } from './prime-ng-tree-table.component';

describe('PrimeNgTreeTableComponent', () => {
  let component: PrimeNgTreeTableComponent;
  let fixture: ComponentFixture<PrimeNgTreeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeNgTreeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeNgTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
